import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom validator decorator that checks if a check-in date is after today's date
 *
 * @param validationOptions - Optional validation options from class-validator
 * @returns A decorator function that can be used to validate check-in dates
 *
 * @example
 * ```typescript
 * class Booking {
 *   @IsCheckInAfterToday()
 *   checkInDate: Date;
 * }
 * ```
 */
export function IsCheckInAfterToday(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCheckInAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `La fecha de check-in debe ser posterior a la fecha actual`;
        },
      },
    });
  };
}

/**
 * Custom validator decorator that checks if a check-out date is after the check-in date
 *
 * @param property - The name of the check-in date property to compare against
 * @param validateOptions - Validation options from class-validator
 * @returns A decorator function that can be used to validate check-out dates
 *
 * @example
 * ```typescript
 * class Booking {
 *   @IsCheckInAfterToday()
 *   checkInDate: Date;
 *
 *   @IsCheckOutAfterCheckIn('checkInDate')
 *   checkOutDate: Date;
 * }
 * ```
 */
export function IsCheckOutAfterCheckIn(
  property,
  validateOptions: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsCheckOutAfterCheckIn',
      target: object.constructor,
      propertyName: propertyName,
      options: validateOptions,
      constraints: [property],
      validator: {
        validate(value, validateArguments: ValidationArguments) {
          const [relatedPropertyName] = validateArguments.constraints;
          const relatedValue = (validateArguments.object as any)[
            relatedPropertyName
          ];
          return value > relatedValue;
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return `La fecha de check-out debe ser posterior a la fecha de check-in`;
        },
      },
    });
  };
}
