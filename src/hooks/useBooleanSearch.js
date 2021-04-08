import { useMemo, useCallback } from "react";
/* eslint-disable no-sequences */
const makeTermReversedMatrix = (data) =>
  data.reduce(
    (acc, item, index) => (
      Object.keys(item).map((prop) =>
        String(item[prop] || " ")
          .split(" ")
          .map((item) => item.toLowerCase())
          .map((item) =>
            prop === "source" || prop === "date" || prop === "author"
              ? item
              : item.replace(/^([“”«»"'-_)(]+)|([“”«»"'-_)(]+)$/gi, "")
          )
          .forEach((term) => {
            if (term.length > 3 || prop === "subject") {
              acc[term] = acc[term] ? [...acc[term], index] : [index];
            }
          })
      ),
      acc
    ),
    {}
  );

const unionArrays = (arr1, arr2) => {
  var obj = {};
  for (let i = arr1.length - 1; i >= 0; --i) obj[arr1[i]] = arr1[i];
  for (let i = arr2.length - 1; i >= 0; --i) obj[arr2[i]] = arr2[i];
  var res = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k))
      // <-- optional
      res.push(obj[k]);
  }
  return res;
};

const intersectionArrays = (arr1, arr2) =>
  arr1.filter((value) => arr2.includes(value));

const exceptionArray = (arr1, data) => {
  const dataIds = data.map((_, index) => index);
  return dataIds.filter((value) => !arr1.includes(value));
};

const parseAndTransformString = (str, matrix, data) => {
  if (!str) {
    return [];
  }

  let splitted = str.split(" ");
  let shouldReverse = false;

  if (splitted.length === 1) {
    return matrix[str] || [];
  }

  if (splitted[0] === "не") {
    shouldReverse = true;
    splitted.shift();
  }

  const result = splitted.reduce(
    (acc, item) => unionArrays(acc, matrix[item] || []),
    matrix[splitted[0]]
  );

  if (shouldReverse) {
    return exceptionArray(result, data);
  }

  return result;
};

const regExp = /(^или$)|(^и$)/;

export const useBooleanSearch = (data) => {
  const matrix = useMemo(() => makeTermReversedMatrix(data), [data]);
  const search = useCallback(
    (query) => {
      let subArray = [];
      const cookedQuery = query
        .toLowerCase()
        .split(" ")
        .reduce((collectArray, item, index, array) => {
          // Если это обычное слово
          if (!item.match(regExp)) {
            subArray = [...subArray, item];
            if (index === array.length - 1) {
              return [...collectArray, subArray.join(" ")];
            }
            return collectArray;
          }
          let res = [];
          if (item === "или") {
            res = [...collectArray, subArray.join(" "), "или"];
          }
          if (item === "и") {
            res = [...collectArray, subArray.join(" "), "и"];
          }
          if (index === array.length - 1) {
            res = [...collectArray, subArray.join(" ")];
          }
          subArray = [];
          return res;
        }, [])
        .filter((item) => item !== "")
        .filter(
          (item, index, array) =>
            !item.match(regExp) ||
            (item.match(regExp) &&
              array[index - 1] &&
              !array[index - 1].match(regExp) &&
              array[index + 1] &&
              !array[index + 1].match(regExp))
        )
        .reduce(
          (acc, item) => {
            const clone = [...acc];
            if (item.match(regExp)) {
              clone[0] = [item, ...clone[0]];
              return clone;
            }
            clone[1] = [item, ...clone[1]];
            return clone;
          },
          [[], []]
        );
      let result = parseAndTransformString(cookedQuery[1].pop(), matrix, data);
      for (let i = cookedQuery[0].length - 1; i >= 0; i--) {
        if (cookedQuery[1].length <= 0) {
          break;
        }

        const arg1 = result;
        const arg2 = parseAndTransformString(
          cookedQuery[1].pop(),
          matrix,
          data
        );
        if (cookedQuery[0][i] === "и") {
          result = intersectionArrays(arg1, arg2);
        }
        if (cookedQuery[0][i] === "или") {
          result = unionArrays(arg1, arg2);
        }
      }
      return Array.from(new Set(result));
    },
    [matrix, data]
  );
  return search;
};
