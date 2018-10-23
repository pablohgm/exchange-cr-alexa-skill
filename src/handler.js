import { dollarExchange } from 'exchangecr'
import { SkillBuilders } from 'ask-sdk-core'

const getDollarExchangeMessage = async () => {
  const result = await dollarExchange()

  return `The US Dollar exchange is ... Sell price: ${result.sellRate} colones and Buy price:${result.buyRate} colones`
}

const isDollar = (handlerInput) => {
  const itemSlot = handlerInput.requestEnvelope.request.intent.slots.Coin
  let itemName
  if (itemSlot && itemSlot.value) {
    itemName = itemSlot.value.toLowerCase()
  }
  return (itemName === 'us dollar' || itemName === 'dollar')
}


/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const speakOutput = MESSAGES.WELCOME_MESSAGE
    const repromptOutput = MESSAGES.WELCOME_REPROMPT

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse()
  },
}

const ExchangeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ExchangeIntent'
  },
  async handle(handlerInput) {
    const repeatRepromptOutput = MESSAGES.REPEAT_MESSAGE_REPROMPT

    if (isDollar(handlerInput)) {
      const speakOutput = await getDollarExchangeMessage()

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repeatRepromptOutput)
        .getResponse()
    }
    else{
      const repeatOutput = MESSAGES.REPEAT_MESSAGE

      return handlerInput.responseBuilder
        .speak(repeatOutput)
        .reprompt(repeatRepromptOutput)
        .getResponse()
    }
  }
}

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const speakOutput = MESSAGES.HELP_MESSAGE
    const repromptSpeech = MESSAGES.HELP_REPROMPT

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptSpeech)
      .getResponse()
  },
}

const RepeatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse()
  },
}

const ExitHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent')
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(MESSAGES.STOP_MESSAGE)
      .getResponse()
  },
}

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log('Inside SessionEndedRequestHandler')
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`)
    return handlerInput.responseBuilder.getResponse()
  }
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak(MESSAGES.ERROR_MESSAGE)
      .reprompt(MESSAGES.ERROR_MESSAGE_REPROMPT)
      .getResponse()
  },
}

/* CONSTANTS */
const MESSAGES = {
  WELCOME_MESSAGE: 'Welcome to Costa Rica Exchange. At the moment you ask for the current dollar price',
  WELCOME_REPROMPT: 'Try saying dollar price or dollar exchange.',
  HELP_MESSAGE: 'You can ask for dollar exchange',
  HELP_REPROMPT: 'You can say things like, what\'s the dollar price?',
  STOP_MESSAGE: 'Goodbye!',
  REPEAT_MESSAGE: 'May you repeat, please',
  REPEAT_MESSAGE_REPROMPT: 'What else can I help with?',
  ERROR_MESSAGE: 'Sorry, I can\'t understand the command. Please say again.',
  ERROR_MESSAGE_REPROMPT: 'Please say again.'
}

/* LAMBDA SETUP */
const startExchange = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ExchangeIntentHandler,
    HelpHandler,
    RepeatHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()

export {
  startExchange
}
