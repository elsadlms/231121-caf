import { getRandomFromArray } from '~/utils'

const threeSteps = true

const firstStepCols = threeSteps === true ? [0, 1, 8, 9] : [0, 1, 2, 7, 8, 9]
const secondStepCols = threeSteps === true ? [2, 7] : []
const thirdStepCols = [3, 4, 5, 6]

const firstStepRows = threeSteps === true ? [0, 5] : [0, 1, 4, 5]
const secondStepRows = threeSteps === true ? [1, 4] : []
const thirdStepRows = [2, 3]

export const colsNumber = [
  ...firstStepCols,
  ...secondStepCols,
  ...thirdStepCols,
].length

export const rowsNumber = [
  ...firstStepRows,
  ...secondStepRows,
  ...thirdStepRows,
].length

const firstStepCount =
  firstStepCols.length * rowsNumber +
  firstStepRows.length * (colsNumber - firstStepCols.length)

const secondStepCount =
  secondStepCols.length * (rowsNumber - firstStepRows.length) +
  secondStepRows.length *
    (colsNumber - firstStepCols.length - secondStepCols.length)

const thirdStepCount =
  thirdStepCols.length *
  (rowsNumber - firstStepRows.length - secondStepRows.length)

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

const getSquareStep = (col, row) => {
  if (firstStepCols.includes(col) || firstStepRows.includes(row)) return 1
  if (secondStepCols.includes(col) || secondStepRows.includes(row)) return 2
  if (thirdStepCols.includes(col) || thirdStepRows.includes(row)) return 3
}

const getSquareOrder = (step) => {
  const availableOrders =
    step === 1
      ? availableFirstStepOrders
      : step === 2
      ? availableSecondStepOrders
      : availableThirdStepOrders

  const order = getRandomFromArray(availableOrders)
  const orderIndex = availableOrders.findIndex((el) => el === order)
  availableOrders.splice(orderIndex, 1)
  return order
}

export const generateSquaresArray = () => {
  const array = []

  let index = 0
  for (let row = 0; row < rowsNumber; row++) {
    for (let col = 0; col < colsNumber; col++) {
      index++

      const step = getSquareStep(col, row)
      const order = getSquareOrder(step)

      const square = {
        id: index,
        row: row,
        col: col,
        score: Math.random(),
        noise: Math.random(),
        order: order,
        step: step,
      }
      array.push(square)
    }
  }

  return array
}