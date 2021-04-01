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

const parseAndTransformString = (str, matrix) => {
  return str
    ? str.split(" ").length > 1
      ? str
          .split(" ")
          .reduce(
            (acc, item) =>
              intersectionArrays(acc, matrix[item] ? matrix[item] : []),
            []
          )
      : matrix[str]
    : [];
};

const regExp = /(^или$)|(^и$)|(^не$)/;

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
          if (!item.match(/(^или$)|(^и$)|(^не$)/)) {
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
          if (item === "не") {
            res = [...collectArray, subArray.join(" "), "не"];
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
            (item === "не" &&
              array[index + 1] &&
              !array[index + 1].match(regExp)) ||
            (item.match(regExp) &&
              array[index - 1] &&
              !array[index - 1].match(regExp) &&
              array[index + 1] &&
              array[index + 1] === "не") ||
            !array[index + 1].match(regExp)
        );
      let result = parseAndTransformString(cookedQuery[0], matrix);
      for (let i = 1; i < cookedQuery.length; i++) {
        const arr1 = result;
        let arr2 = [];
        if (cookedQuery[i + 1] === "не") {
          arr2 = exceptionArray(
            parseAndTransformString(cookedQuery[i + 2], matrix),
            data
          );
        } else {
          arr2 = parseAndTransformString(cookedQuery[i + 1], matrix);
        }

        if (cookedQuery[i] === "или") {
          result = unionArrays(arr1, arr2);
        }
        if (cookedQuery[i] === "и") {
          result = intersectionArrays(arr1, arr2);
        }
      }
      return Array.from(new Set(result));
    },
    [matrix, data]
  );
  return search;
};
