from io import BytesIO
from typing import Optional, Tuple

import torch
from transformers import BertForMaskedLM

import boto3

class GenericClassifier(torch.nn.Module):
  def __init__(self,model,name,labels):
    super(GenericClassifier,self).__init__()
    self.name = name
    self.base_model = model.base_model
    self.config = model.config
    self.labels = labels
    self.cls = torch.nn.Linear(self.config.hidden_size, len(labels))

  def forward(
    self,
    input_ids: Optional[torch.Tensor] = None,
    attention_mask: Optional[torch.Tensor] = None,
    token_type_ids: Optional[torch.Tensor] = None,
    ) ->Tuple[torch.Tensor]:

    outputs = self.base_model(
      input_ids,
      attention_mask=attention_mask,
      #token_type_ids=token_type_ids,
    )
    sequence_output = outputs[0][:,0,:]
    prediction = self.cls(sequence_output)
    return prediction

class ChatbotClassifier:
  def __init__(self) -> None:
    self.device = torch.device("cpu")
    self.prediction = ['apresentacao', 'cancelar_pedido', 'cardapio', 'confirmar_pedido',
      'fazer_pedido', 'horario_funcionamento', 'nao', 'sim',
      'tempo_entrega']

    s3_client = boto3.client("s3")

    file_content = s3_client.get_object(Bucket='pizzaria-3000-models', Key='bert-base-portuguese-cased.pth')["Body"].read()

    model_checkpoint = torch.load(BytesIO(file_content), map_location=self.device)

    self.intentions = model_checkpoint['intentions']
    self.tokenizer = model_checkpoint['tokenizer']

    model_pretrained = BertForMaskedLM(model_checkpoint['config'])

    self.model = GenericClassifier(model=model_pretrained ,name="bert-base-portuguese-cased",labels=self.intentions).to(self.device)
    self.model.load_state_dict(model_checkpoint['model'])
    self.model.eval()

  def __call__(self, telegram_message: str) -> str:
    token=self.tokenizer(telegram_message, return_tensors='pt').to(self.device)
    pred=self.model(**token)
    response = self.prediction[pred.argmax(dim=-1).cpu()[0]]

    return response
