import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type queryError = SerializedError | FetchBaseQueryError;

export const isFetchedBaseQueryError = (error: queryError): error is FetchBaseQueryError => {
	return error && typeof error === "object" && "status" in error;
}

export const isSerializedError = (error: queryError): error is SerializedError => {
	return error && typeof error === "object" && "message" in error;
}