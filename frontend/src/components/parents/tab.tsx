import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ParentDataTable } from "@/components/parents/data-table";
import { useFetchParents } from "@/data/parent";
import {
  fetchParents,
  selectError,
  selectLoading,
  selectParents,
} from "@/lib/redux/slices/parent.slice";
import type { AppDispatch } from "@/lib/redux/stores";

export default function ParentTab() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectParents);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const { data, isLoading: isQueryLoading } = useFetchParents();

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  if (loading || isQueryLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <ParentDataTable data={data || items} />
    </div>
  );
}
