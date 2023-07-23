/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import {
  __,
  allPass,
  andThen,
  complement,
  gt,
  length,
  lt,
  modulo,
  otherwise,
  partialRight,
  pipe,
  prop,
  tap,
  test,
  when,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const makeQuery = (number) => ({
    number,
    from: 10,
    to: 2,
  });
  const makeUrl = (number) => `https://animals.tech/${number}`;

  const isValueValid = allPass([
    pipe(length, lt(__, 10)),
    pipe(length, gt(__, 2)),
    pipe(Number, gt(__, 0)),
    test(/^[0-9.]*$/),
  ]);

  const workWithValidValue = pipe(
    Number,
    Math.round,
    tap(writeLog),
    makeQuery,
    api.get("https://api.tech/numbers/base", __),
    otherwise(handleError),
    andThen(
      pipe(
        prop("result"),
        tap(writeLog),
        length,
        tap(writeLog),
        partialRight(Math.pow, [2]),
        tap(writeLog),
        modulo(__, 3),
        tap(writeLog),
        makeUrl,
        api.get(__, {}),
        otherwise(handleError),
        andThen(pipe(prop("result"), handleSuccess))
      )
    )
  );

  const workWithInvalidValue = () => handleError("ValidationError");

  pipe(
    tap(writeLog),
    tap(when(isValueValid, workWithValidValue)),
    tap(when(complement(isValueValid), workWithInvalidValue))
  )(value);
};

export default processSequence;
