/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  __,
  allPass,
  and,
  anyPass,
  apply,
  complement,
  count,
  equals,
  gte,
  map,
  pipe,
  prop,
  propEq,
  props,
  reduce,
  values,
  where,
} from "ramda";

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = where({
  star: equals("red"),
  square: equals("green"),
  triangle: equals("white"),
  circle: equals("white"),
});

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(values, count(equals("green")), gte(__, 2));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = allPass([
  pipe(values, count(equals("blue")), equals(2)),
  pipe(values, count(equals("red")), equals(2)),
]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = where({
  circle: equals("blue"),
  star: equals("red"),
  square: equals("orange"),
});

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  pipe(values, count(equals("red")), gte(__, 3)),
  pipe(values, count(equals("green")), gte(__, 3)),
  pipe(values, count(equals("blue")), gte(__, 3)),
  pipe(values, count(equals("orange")), gte(__, 3)),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  pipe(values, count(equals("green")), equals(2)),
  pipe(prop("triangle"), equals("green")),
  pipe(values, count(equals("red")), equals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(
  values,
  map(equals("orange")),
  reduce(and, true)
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  complement(propEq("red", "star")),
  complement(propEq("white", "star")),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(
  values,
  map(equals("green")),
  reduce(and, true)
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  pipe(props(["triangle", "square"]), apply(equals)),
  complement(propEq("white", "triangle")),
  complement(propEq("white", "square")),
]);
