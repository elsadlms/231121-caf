import { getRandomFromArray } from '~/utils'

const highScoreLimit = 0.7
const highScoreProportion = 0.1

const canBeHighScore = (square) => {
  if (square.score >= highScoreLimit) return false
  // seulement si on en isole un seul : pas au bord de la grille
  // if (square.col === 0 || square.col === colsNumber - 1) return false
  // if (square.row === 0 || square.row === rowsNumber - 1) return false
  return true
}

export const generateSquaresArray = (grid) => {
  const array = []

  const colsNumber = [
    ...grid.cols.firstStep,
    ...grid.cols.secondStep,
    ...grid.cols.thirdStep,
  ].length
  const rowsNumber = [
    ...grid.rows.firstStep,
    ...grid.rows.secondStep,
    ...grid.rows.thirdStep,
  ].length

  const squaresNumber = colsNumber * rowsNumber

  // if (array.length === squaresNumber) return array
  // if (array.length > 0) array.length = 0

  const firstStepCount =
    grid.cols.firstStep.length * rowsNumber +
    grid.rows.firstStep.length * (colsNumber - grid.cols.firstStep.length)

  const secondStepCount =
    grid.cols.secondStep.length * (rowsNumber - grid.rows.firstStep.length) +
    grid.rows.secondStep.length *
      (colsNumber - grid.cols.firstStep.length - grid.cols.secondStep.length)

  const thirdStepCount =
    grid.cols.thirdStep.length *
    (rowsNumber - grid.rows.firstStep.length - grid.rows.secondStep.length)

  const availableFirstStepOrders = Array.from(
    { length: firstStepCount },
    (_el, i) => i
  )
  const availableSecondStepOrders = Array.from(
    { length: secondStepCount },
    (_el, i) => i + firstStepCount
  )
  const availableThirdStepOrders = Array.from(
    { length: thirdStepCount },
    (_el, i) => i + firstStepCount + secondStepCount
  )

  const availableOrders = Array.from(
    { length: squaresNumber },
    (_el, i) => i
  )

  let index = 0
  for (let row = 0; row < rowsNumber; row++) {
    for (let col = 0; col < colsNumber; col++) {
      index++

      let step = 0
      if (
        grid.cols.firstStep.includes(col) ||
        grid.rows.firstStep.includes(row)
      ) {
        step = 1
      } else if (
        grid.cols.secondStep.includes(col) ||
        grid.rows.secondStep.includes(row)
      ) {
        step = 2
      } else if (
        grid.cols.thirdStep.includes(col) ||
        grid.rows.thirdStep.includes(row)
      ) {
        step = 3
      }

      const order = getRandomFromArray(availableOrders)
      const orderIndex = availableOrders.findIndex((el) => el === order)
      availableOrders.splice(orderIndex, 1)

      const square = {
        id: index,
        row: row,
        col: col,
        score: Math.random() * highScoreLimit,
        noise: Math.random(),
        order: order,
        step: step,
      }
      array.push(square)
    }
  }

  const highScoreSquares = squaresNumber * highScoreProportion

  for (let i = 0; i < highScoreSquares; i++) {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * array.length)
    } while (canBeHighScore(array[randomIndex]) === false)

    array[randomIndex].score = 1 - Math.random() * (1 - highScoreLimit)
  }

  return array
}
