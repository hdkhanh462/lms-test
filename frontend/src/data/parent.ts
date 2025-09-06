import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEY } from "@/constants/querry-key";
import api from "@/lib/axios";
import type {
  ParentInput,
  ParentWithIdInput,
} from "@/validations/schemas/parent.schema";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useFetchParents = () => {
  return useQuery<ParentWithIdInput[], Error>({
    queryKey: [QUERY_KEY.PARENTS],
    queryFn: async () => {
      const response = await api.get<ParentWithIdInput[]>(
        `/${QUERY_KEY.PARENTS}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useAddParent = () => {
  const queryClient = useQueryClient();
  return useMutation<ParentWithIdInput, Error, ParentInput>({
    mutationFn: async (newParent) => {
      const response = await api.post<ParentWithIdInput>(
        `/${QUERY_KEY.PARENTS}`,
        newParent
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENTS] });
      toast.success("Thêm phụ huynh thành công");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        toast.error("Lỗi khi thêm phụ huynh", {
          description: error.response?.data?.message,
        });
      }
    },
  });
};

export const useGetParentById = (id: number) => {
  return useQuery<ParentWithIdInput, Error>({
    queryKey: [QUERY_KEY.PARENTS, id],
    queryFn: async () => {
      const response = await api.get<ParentWithIdInput>(
        `/${QUERY_KEY.PARENTS}/${id}`
      );
      return response.data;
    },
  });
};

export const useUpdateParent = () => {
  const queryClient = useQueryClient();
  return useMutation<ParentWithIdInput, Error, ParentWithIdInput>({
    mutationFn: async (updatedParent) => {
      const response = await api.put<ParentWithIdInput>(
        `/${QUERY_KEY.PARENTS}/${updatedParent.id}`,
        updatedParent
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENTS] });
      toast.success("Cập nhật phụ huynh thành công");
    },
  });
};
