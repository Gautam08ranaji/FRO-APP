// types/froLocation.ts

export interface AddOrUpdateFROLocationPayload {
  name: string;
  latitute: string;        // ❗ backend typo – must stay
  longititute: string;     // ❗ backend typo – must stay
  discriptions: string;    // ❗ backend typo – must stay
  elderPinLocation: string;
  froPinLocation: string;
  tikcetNumber: string;    // ❗ backend typo – must stay
  froStatus: string;
  userId: string;
}
