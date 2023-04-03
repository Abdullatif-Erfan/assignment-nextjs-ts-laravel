import React, { useState, useEffect } from "react";
import { axiosInstanceWithJsonType } from "../utils/axios";

const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    /**
     * AbortController Usage:
     * 1. For each network request create a signal and track them
     * 2. Cancel the previous request if recieve new request
     * 3. Clean up the request if component is unmounted and prevent from memory leak
     * 
     * EXAMPL
     * if we click on student list, request will be sent to the server, 
     * immediately if we click on insert button, it will open student_add component, so the previous   request should be cancelled. 
     */
    const controller = new AbortController()
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstanceWithJsonType.get(url, { signal: controller.signal });
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
    /**
     * Cancel Fetching the data from previous request
     */
    return () => {
      controller.abort();
    }
    // }, [url]);
  }, []);

  const reFetch = async () => {
    const controllerReFetch = new AbortController()
    setLoading(true);
    try {
      const res = await axiosInstanceWithJsonType.get(url, { signal: controllerReFetch.signal });
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
    /**
     * Cancel Fetching the data from previous request
     */
    return () => {
      controllerReFetch.abort();
    }
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
