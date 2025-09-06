import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

import { QUERY_KEY } from "@/constants/querry-key";
import api from "@/lib/axios";
import type {
  ClassInput,
  ClassWithIdInput,
  dayQueryOptions,
} from "@/validations/schemas/class.schema";

export const useFetchClasses = () => {
  const [dayFilter, setDayFilter] = useState<keyof typeof dayQueryOptions>();
  const query = useQuery<ClassWithIdInput[], Error>({
    queryKey: [QUERY_KEY.CLASSES, dayFilter === undefined ? "ALL" : dayFilter],
    queryFn: async () => {
      const response = await api.get<ClassWithIdInput[]>(
        `/${QUERY_KEY.CLASSES}${dayFilter ? `?day=${dayFilter}` : ""}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    dayFilter,
    setDayFilter,
  };
};

export const useAddClass = () => {
  const queryClient = useQueryClient();
  return useMutation<ClassWithIdInput, Error, ClassInput>({
    mutationFn: async (newClass) => {
      const response = await api.post<ClassWithIdInput>(
        `/${QUERY_KEY.CLASSES}`,
        newClass
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLASSES] });
      toast.success("Thêm lớp học thành công");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        toast.error("Lỗi khi thêm lớp học", {
          description: error.response?.data?.message,
        });
      }
    },
  });
};

export const useGetClassById = (id: number) => {
  return useQuery<ClassWithIdInput, Error>({
    queryKey: [QUERY_KEY.CLASSES, id],
    queryFn: async () => {
      const response = await api.get<ClassWithIdInput>(
        `/${QUERY_KEY.CLASSES}/${id}`
      );
      return response.data;
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation<ClassWithIdInput, Error, ClassWithIdInput>({
    mutationFn: async (updatedClass) => {
      const response = await api.put<ClassWithIdInput>(
        `/${QUERY_KEY.CLASSES}/${updatedClass.id}`,
        updatedClass
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLASSES] });
      toast.success("Cập nhật lớp học thành công");
    },
  });
};
