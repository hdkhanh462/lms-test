import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { QUERY_KEY } from "@/constants/querry-key";
import api from "@/lib/axios";
import type {
  AddSubscriptionInput,
  SubscriptionWithIdInput,
  SubscriptionWithStudentInput,
} from "@/validations/schemas/subscription.schema";

export const useFetchSubscriptions = () => {
  return useQuery<SubscriptionWithStudentInput[], Error>({
    queryKey: [QUERY_KEY.SUBSCRIPTIONS],
    queryFn: async () => {
      const response = await api.get<SubscriptionWithStudentInput[]>(
        `/${QUERY_KEY.SUBSCRIPTIONS}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useAddSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation<SubscriptionWithStudentInput, Error, AddSubscriptionInput>(
    {
      mutationFn: async (newSubscription) => {
        const response = await api.post<SubscriptionWithStudentInput>(
          `/${QUERY_KEY.SUBSCRIPTIONS}`,
          newSubscription
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SUBSCRIPTIONS] });
        toast.success("Thêm khóa học thành công");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          console.log(error.response?.data);
          toast.error("Lỗi khi thêm khóa học", {
            description: error.response?.data?.message,
          });
        }
      },
    }
  );
};

export const useGetSubscriptionById = (id: number) => {
  return useQuery<SubscriptionWithStudentInput, Error>({
    queryKey: [QUERY_KEY.SUBSCRIPTIONS, id],
    queryFn: async () => {
      const response = await api.get<SubscriptionWithStudentInput>(
        `/${QUERY_KEY.SUBSCRIPTIONS}/${id}`
      );
      return response.data;
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SubscriptionWithStudentInput,
    Error,
    SubscriptionWithIdInput
  >({
    mutationFn: async (updatedSubscription) => {
      const response = await api.put<SubscriptionWithStudentInput>(
        `/${QUERY_KEY.SUBSCRIPTIONS}/${updatedSubscription.id}`,
        updatedSubscription
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SUBSCRIPTIONS] });
      toast.success("Cập nhật khóa học thành công");
    },
  });
};

export const useMarkSubscriptionUsed = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    SubscriptionWithStudentInput,
    Error,
    { studentId: number }
  >({
    mutationFn: async ({ studentId }) => {
      const response = await api.patch<SubscriptionWithStudentInput>(
        `/${QUERY_KEY.SUBSCRIPTIONS}/${id}/use`,
        {
          studentId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SUBSCRIPTIONS] });
      toast.success("Đánh dấu đã học thành công");
    },
  });
};
