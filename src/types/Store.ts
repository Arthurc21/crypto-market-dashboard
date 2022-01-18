import { UserData } from "./UserData";

export interface Store {
	currentUsdMxnRateConversion?: number
	userData: UserData
}