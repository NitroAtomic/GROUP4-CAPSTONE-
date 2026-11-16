// Ginugulo ang pagkakasunod ng mga pagpipilian sa bawat tanong.
//
// Puna ng expert reviewer (Pena): halos laging B ang tamang sagot sa mga
// module quiz (mga 76%), at laging C sa scenario questions ng assessment.
// Kaya nahuhulaan ang sagot nang hindi binabasa ang tanong.
//
// Ligtas ito sa scoring: ang sinusuri ay ang `value` ng napili ("a", "b"...),
// hindi ang puwesto nito sa screen. Walang letra na ipinapakita sa tabi ng
// pagpipilian, kaya walang "A." na magkakamali ng turo.
//
// Hindi ginagalaw ang True/False, para laging True muna bago False.

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function isTrueFalse(options) {
  if (!Array.isArray(options) || options.length !== 2) return false
  const texts = options.map((option) => String(option.text).trim().toLowerCase()).sort()
  return texts[0] === 'false' && texts[1] === 'true'
}

// Pagpipilian na tumutukoy sa iba ("All of the above", "Both A and B") ay
// hindi puwedeng ilipat, kasi masisira ang kahulugan nila.
const REFERS_TO_OTHERS = /\b(all|none) of the above\b|\bboth [a-e] and [a-e]\b|\b(option|choice) [a-e]\b/i

export function shuffleOptions(question) {
  const options = question && question.options
  if (!Array.isArray(options) || options.length < 2) return question
  if (isTrueFalse(options)) return question
  if (options.some((option) => REFERS_TO_OTHERS.test(String(option.text)))) return question
  return { ...question, options: shuffle(options) }
}

export function shuffleEachQuestionsOptions(questions) {
  return (questions || []).map(shuffleOptions)
}

export default shuffleOptions
