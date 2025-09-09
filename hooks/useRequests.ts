import axios from "axios";
import Toast from "react-native-toast-message";
import {useCallback} from "react";
import {
    NavigationProp,
    ParamListBase,
    useNavigation,
} from "@react-navigation/native";

import {getTokens, isAuthenticated, logout, setTokens, UserTokens} from "@/utils/Auth";

export const SERVER_URL: string = "https://joinme-app.com";
export const SERVER_AJAX_URL: string = `${SERVER_URL}/backend/mobile_app`;

type ShowOptions = {
    error?: boolean;
    success?: boolean;
};

type SendDefaultRequestArgs = {
    url: string;
    data?: any;
    sendLog?: boolean,
    showOptions?: ShowOptions;
};

export type SuccessResponse = {
    success: boolean;
    message?: string;
    tokensError?: boolean;
    tokens?: UserTokens | null;

    [key: string]: unknown;
};

export type ErrorResponse = {
    success: boolean;
    message?: string;

    [key: string]: unknown;
};

export const useRequests = () => {
    let navigation: NavigationProp<ParamListBase> | null = null;

    try {
        navigation = useNavigation<NavigationProp<ParamListBase>>();
    } catch {
        navigation = null;
    }

    const sendDefaultRequest = useCallback(
        async <T extends SuccessResponse = SuccessResponse>(
            { url, data = {}, showOptions = {}, sendLog = true }: SendDefaultRequestArgs
        ): Promise<T> => {
            const finalShow: Required<ShowOptions> = {
                error: true,
                success: true,
                ...showOptions,
            };

            let errorMessage = "An error occurred, please try again later";

            const formData = new FormData();

            if (getTokens() !== null) data["tokens"] = getTokens();

            // Object.keys(data).forEach((key) => {
            //     const value = data[key] as unknown;

            //     if (
            //         typeof value === "object" &&
            //         value !== null &&
            //         (value as ImageValue)?.type === "image" &&
            //         (value as ImageValue)?.uri
            //     ) {
            //         const img = value as ImageValue;
            //         const ext = getFileTypeFromUri(img.uri) || "jpeg";
            //         // @ts-ignore — в React Native типизация FormData не идеально точная
            //         formData.append(key, {
            //             uri: img.uri,
            //             type: `image/${ext}`,
            //             name: `image.${ext}`,
            //         });
            //     } else {
            //         let selData: any = value;

            //         if (typeof selData === "boolean") selData = selData ? 1 : 0;
            //         else if (typeof selData === "object" && selData !== null)
            //             selData = JSON.stringify(value);

            //         formData.append(key, selData);
            //     }
            // });

            Object.keys(data).forEach((key) => {
              const value = data[key] as any;

              if (
                value &&
                typeof value === "object" &&
                "uri" in value &&
                "name" in value &&
                "mime" in value
              ) {
                  // @ts-ignore — в React Native типизация FormData не идеально точная
                formData.append(key, {
                  uri: value.uri,
                  name: value.name,
                  type: value.mime,
                });
                return;
              }

              let selData: any = value;
              if (typeof selData === "boolean") selData = selData ? 1 : 0;
              else if (typeof selData === "object" && selData !== null)
                selData = JSON.stringify(value);

              formData.append(key, selData);
            });


            try {
                const { data: result } = await axios.post<T>(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (result.success !== undefined) {
                    if (result.success) {
                        if (finalShow.success && result.message) {
                            Toast.show({ type: "success", text1: result.message });
                        }

                        if (result.tokens && typeof result.tokens === "object") {
                            setTokens(result.tokens);
                        }

                        return Promise.resolve(result);
                    } else {
                        if (result.tokensError && isAuthenticated()) {
                            await logout();

                            if (navigation) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "(tabs)" as never }],
                                });
                            }
                        }

                        if (sendLog) sendLogError(url, data, result)

                        if (finalShow.error && result.message) {
                            Toast.show({
                                type: "error",
                                text1: result.message + ((result as any).error ? ` (${(result as any).error})` : ""),
                            });
                        }

                        return Promise.reject(result as ErrorResponse);
                    }
                }

                if (sendLog) sendLogError(url, data, result)
                return Promise.reject({ success: false, message: errorMessage } as ErrorResponse);
            } catch (err: any) {
                if (finalShow.error) {
                    Toast.show({ type: "error", text1: errorMessage });
                }

                if (sendLog) sendLogError(url, data, err)

                return Promise.reject({
                    success: false,
                    message: err?.message ?? errorMessage,
                } as ErrorResponse);
            }
        },
        [navigation]
    );

    return { sendDefaultRequest };
};

const sendLogError = (url: string, data: any, result: any) => {
    if (data.tokens) delete data.tokens

    console.error(`Response error, url - ${url}`)
    console.error(`Sent data - ` + (typeof data === "object" ? JSON.stringify(data) : data))
    console.error(`Received data - ` + (typeof result === "object" ? JSON.stringify(result) : result))
}
