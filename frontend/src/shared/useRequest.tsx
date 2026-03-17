import {
    useQuery,
    useMutation,
    type UseQueryOptions,
    type UseMutationOptions,
} from "@tanstack/react-query"

type RequestConfig = {
    url: string
    method?: string
    body?: unknown
    headers?: Record<string, string>
}

async function request<T>(config: RequestConfig): Promise<T> {
    const { url, method = "GET", body, headers } = config

    const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }))
        throw error
    }

    return res.json()
}

// Auto request (query) — fires automatically
type UseAutoRequestOptions<T> = {
    queryKey: unknown[]
    url: string
    method?: string
    headers?: Record<string, string>
} & Omit<UseQueryOptions<T>, "queryKey" | "queryFn">

export function useAutoRequest<T = unknown>(options: UseAutoRequestOptions<T>) {
    const { queryKey, url, method, headers, ...queryOptions } = options

    return useQuery<T>({
        queryKey,
        queryFn: () => request<T>({ url, method, headers }),
        refetchInterval: 25_000,
        refetchIntervalInBackground: false,
        ...queryOptions,
    })
}

// Manual request (mutation) — fires on mutate()
type UseMutateRequestOptions<TData, TVariables> = {
    url: string | ((variables: TVariables) => string)
    method?: string
    headers?: Record<string, string>
} & Omit<UseMutationOptions<TData, unknown, TVariables>, "mutationFn">

export function useMutateRequest<TData = unknown, TVariables = unknown>(
    options: UseMutateRequestOptions<TData, TVariables>,
) {
    const { url, method = "POST", headers, ...mutationOptions } = options

    return useMutation<TData, unknown, TVariables>({
        mutationFn: (variables) => {
            const resolvedUrl = typeof url === "function" ? url(variables) : url
            return request<TData>({
                url: resolvedUrl,
                method,
                headers,
                body: variables,
            })
        },
        ...mutationOptions,
    })
}
