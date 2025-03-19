import dayjs from 'dayjs';
import { dropWhile as _dropWhile, round as _round } from 'lodash-es';

export const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
export const STANDARD_TIME_FORMAT = 'HH:mm';
export const STANDARD_DATETIME_FORMAT = 'MMMM D YYYY, HH:mm:ss.SSS';

/** @constant 1ms as the number of microseconds, which is the precision of Jaeger timestamps */
export const ONE_MILLISECOND = 1000 * 1;

const ONE_SECOND = 1000 * ONE_MILLISECOND;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

const DEFAULT_MS_PRECISION = Math.log10(ONE_MILLISECOND);

const UNIT_STEPS: { unit: string; microseconds: number; ofPrevious: number }[] =
  [
    { unit: 'd', microseconds: ONE_DAY, ofPrevious: 24 },
    { unit: 'h', microseconds: ONE_HOUR, ofPrevious: 60 },
    { unit: 'm', microseconds: ONE_MINUTE, ofPrevious: 60 },
    { unit: 's', microseconds: ONE_SECOND, ofPrevious: 1000 },
    { unit: 'ms', microseconds: ONE_MILLISECOND, ofPrevious: 1000 },
    { unit: 'μs', microseconds: 1, ofPrevious: 1000 },
  ];

// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

/**
 * @param {number} duration - Unix Time
 * @return {string} formatted, unit-labelled string with time in milliseconds
 *
 * @example
 * ```
 * formatDate(0) // => 1970-01-01
 * ```
 */
export function formatDate(duration: number): string {
  return dayjs(duration / ONE_MILLISECOND).format(STANDARD_DATE_FORMAT);
}

/**
 * @param {number} duration - Unix Time
 * @return {string} formatted, unit-labelled string with time in milliseconds
 *
 * @example
 * ```
 * formatTime(0) // => 00:00
 * ```
 */
export function formatTime(duration: number): string {
  return dayjs(duration / ONE_MILLISECOND).format(STANDARD_TIME_FORMAT);
}

/**
 * Humanizes the duration for display.
 *
 * @example
 * 5000ms => 5s
 * 1000μs => 1ms
 * 183840s => 2d 3h
 *
 * @param {number} duration - Unix Time
 * @return {string} formatted duration
 */
export function formatDuration(duration: number): string {
  // Drop all units that are too large except the last one
  const [primaryUnit, secondaryUnit] = _dropWhile(
    UNIT_STEPS,
    ({ microseconds }, index) =>
      index < UNIT_STEPS.length - 1 && microseconds > duration,
  );

  if (primaryUnit.ofPrevious === 1000) {
    // If the unit is decimal based, display as a decimal
    return `${_round(duration / primaryUnit.microseconds, 2)}${
      primaryUnit.unit
    }`;
  }

  const primaryValue = Math.floor(duration / primaryUnit.microseconds);
  const primaryUnitString = `${primaryValue}${primaryUnit.unit}`;
  const secondaryValue = Math.round(
    (duration / secondaryUnit.microseconds) % primaryUnit.ofPrevious,
  );
  const secondaryUnitString = `${secondaryValue}${secondaryUnit.unit}`;
  return secondaryValue === 0
    ? primaryUnitString
    : `${primaryUnitString} ${secondaryUnitString}`;
}
