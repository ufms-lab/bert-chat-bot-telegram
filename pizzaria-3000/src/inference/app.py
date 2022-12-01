from classifier import ChatbotClassifier

classifier = ChatbotClassifier()

def handler(event, context):
    print('[Started] Pizzaria 3000!')

    print('[Menssage]: ', event['telegram_message'])

    intention = classifier(event['telegram_message'])

    print('[Intention]: ', intention)

    print('[Finished]Pizzaria 3000!')
    return {
        'statusCode': 200,
        'body': str(intention)
    }
