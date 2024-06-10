import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type queryError = SerializedError | FetchBaseQueryError;

export const isFetchedBaseQueryError = (error: queryError): error is FetchBaseQueryError => {
	return error && typeof error === "object" && "status" in error;
}

export const isSerializedError = (error: queryError): error is SerializedError => {
	return error && typeof error === "object" && "message" in error;
}

export const getErrorMessage = (isError: boolean, error: (queryError | undefined)) => {
	if (!isError) return;
	if (error === undefined) return;

	if (isSerializedError(error)) {
		return error?.message;
	}

	switch (error.status) {
		case 400:
			// Handle specific error status codes
			return error.data?.toString(); // Assuming error.data is a string or convertible to a string
		case 'FETCH_ERROR':
			return error.error;
		case 'PARSING_ERROR':
			return `Parsing error: ${error.error}`;
		case 'TIMEOUT_ERROR':
			return 'Request timed out';
		case 'CUSTOM_ERROR':
			return error.error;
		default:
			return 'An unknown error occurred';
	}
}
