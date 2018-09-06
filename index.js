const pupp = require('puppeteer')
const questions = require('.questions')

const name = '4INF-HP-M'
const delay = 0
let actualQuestion = null

const main = async () => {
  const browser = await pupp.launch({headless: false})
  const quizPage = await browser.newPage()
  await quizPage.goto('https://www.onlinequizcreator.com/fr/jeu-concours-sur-le-conseil-federal/quiz-342457', {waitUntil: 'networkidle2'})
  
  await quizPage.waitForSelector('.startquiz')
  await quizPage.click('.startquiz')
  await quizPage.waitForSelector('#RegisterUnverifiedParticipantForm')
  await quizPage.type('#registerunverifiedparticipantform-username', name, {delay: 5})
  
  // JQuery Error => click two times with a delay
  await quizPage.click('#RegisterUnverifiedParticipantForm button')
  await quizPage.waitFor(200)
  await quizPage.click('#RegisterUnverifiedParticipantForm button')

  // Quizz begin
  await quizPage.waitForSelector('.answers')

  const yeah = async () => {
    let question = await quizPage.evaluate(() => document.querySelector('#questioncontainer fieldset header h1').textContent)
    question = question.substring(3, question.length).replace('\n', '').trim()
    if (question !== actualQuestion) {
      actualQuestion = question
      const answer = questions.get(question)
      await quizPage.$$eval('.answers li', (nodes, answer) => {
        const answerElement = nodes.find(node => node.textContent.trim() === answer.trim())
        if (answerElement) {
          answerElement.firstChild.firstChild.firstChild.click()
        }
      }, answer)
    }
  }

  while (true) {
    await yeah()
    await quizPage.waitFor(delay)
  }

  // await browser.close()
}

main()
