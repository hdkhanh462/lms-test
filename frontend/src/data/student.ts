import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { QUERY_KEY } from "@/constants/querry-key";
import api from "@/lib/axios";
import type {
  StudentAddInput,
  StudentWithIdInput,
} from "@/validations/schemas/student.schema";

export const useFetchStudents = () => {
  return useQuery<StudentWithIdInput[], Error>({
    queryKey: [QUERY_KEY.STUDENTS],
    queryFn: async () => {
      const response = await api.get<StudentWithIdInput[]>(
        `/${QUERY_KEY.STUDENTS}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation<StudentWithIdInput, Error, StudentAddInput>({
    mutationFn: async (newStudent) => {
      const response = await api.post<StudentWithIdInput>(
        `/${QUERY_KEY.STUDENTS}`,
        newStudent
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.STUDENTS] });
      toast.success("Thêm học sinh thành công");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        toast.error("Lỗi khi thêm học sinh", {
          description: error.response?.data?.message,
        });
      }
    },
  });
};

export const useGetStudentById = (id: number) => {
  return useQuery<StudentWithIdInput, Error>({
    queryKey: [QUERY_KEY.STUDENTS, id],
    queryFn: async () => {
      const response = await api.get<StudentWithIdInput>(
        `/${QUERY_KEY.STUDENTS}/${id}`
      );
      return response.data;
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation<StudentWithIdInput, Error, StudentWithIdInput>({
    mutationFn: async (updatedStudent) => {
      const response = await api.put<StudentWithIdInput>(
        `/${QUERY_KEY.STUDENTS}/${updatedStudent.id}`,
        updatedStudent
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.STUDENTS] });
      toast.success("Cập nhật học sinh thành công");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        toast.error("Lỗi khi cập nhật học sinh", {
          description: error.response?.data?.message,
        });
      }
    },
  });
};
