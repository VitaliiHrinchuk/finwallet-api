import { ValidateIf, ValidationOptions } from "class-validator";

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return function IsNullableDecorator(prototype: Object, propertyKey: string | symbol) {
    console.log('aaa');
    ValidateIf((obj) => (obj)[propertyKey] !== null, options)(prototype, propertyKey);
  };
}

