import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { QUERY_KEY } from "@/constants/querry-key";
import api from "@/lib/axios";
import {
  addParent,
  updateParent,
  type Parent,
} from "@/lib/redux/slices/parent.slice";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useFetchParents = () => {
  return useQuery<Parent[], Error>({
    queryKey: [QUERY_KEY.PARENTS],
    queryFn: async () => {
      const response = await api.get<Parent[]>(`/${QUERY_KEY.PARENTS}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useAddParent = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation<
    Parent,
    Error,
    { name: string; phone: string; email: string }
  >({
    mutationFn: async (newParent) => {
      const response = await api.post<Parent>(
        `/${QUERY_KEY.PARENTS}`,
        newParent
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENTS] });
      dispatch(addParent(data));
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

export const useUpdateParent = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation<
    Parent,
    Error,
    { id: number; name: string; phone: string; email: string }
  >({
    mutationFn: async (updatedParent) => {
      const response = await api.put<Parent>(
        `/${QUERY_KEY.PARENTS}/${updatedParent.id}`,
        updatedParent
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PARENTS] });
      dispatch(updateParent(data));
    },
  });
};
