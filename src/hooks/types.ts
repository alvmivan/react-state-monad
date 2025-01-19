/**
 * Helper type that ensures a field is a valid key of an object and that the field's type matches the expected type.
 *
 * @template TObject - The object type.
 * @template TField - The expected type of the field.
 */
export type ValidFieldFrom<TObject, TField> = {
    [Key in keyof TObject]: TObject[Key] extends TField ? Key : never;
}[keyof TObject];

 

