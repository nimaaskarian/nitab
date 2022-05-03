import { useEffect, useMemo, useState } from "react";

const useAudioDevices = (
  frequencyBinCount = 128,
  deviceId,
  roundingStep = 5
) => {
  const [mediaDevices, setMediaDevices] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [source, setSource] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  const [dataArray, setDataArray] = useState(new Uint8Array(frequencyBinCount));
  useEffect(() => {
    setAudioContext(new AudioContext());
    const fetchMediaDevices = async () => {
      setMediaDevices(await navigator.mediaDevices.enumerateDevices());
    };
    fetchMediaDevices(new AudioContext());
    navigator.mediaDevices.addEventListener("devicechange", fetchMediaDevices);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        fetchMediaDevices
      );
    };
  }, []);
  useEffect(() => {
    if (audioContext) setAnalyser(audioContext.createAnalyser());
  }, [audioContext]);

  useEffect(() => {
    const fetchRecorder = async () => {
      const audio = deviceId ? { deviceId: { exact: deviceId } } : true;
      try {
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      } catch (error) {
        console.log(error);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio });
      setMediaRecorder(new MediaRecorder(stream));
    };
    fetchRecorder();
    navigator.mediaDevices.addEventListener("devicechange", fetchRecorder);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", fetchRecorder);
    };
  }, [deviceId]);
  useEffect(() => {
    if (mediaRecorder && audioContext) {
      if (!["recording", "inactive"].includes(mediaRecorder.state))
        mediaRecorder.start();
      setSource(audioContext.createMediaStreamSource(mediaRecorder.stream));
      return () => {
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      };
    }
  }, [audioContext, mediaRecorder, mediaRecorder?.inactive]);
  useEffect(() => {
    if (analyser) analyser.fftSize = frequencyBinCount;
  }, [analyser, frequencyBinCount]);

  useEffect(() => {
    if (source && analyser) {
      source.connect(analyser);
      const report = () => {
        const _int8data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(_int8data);
        setDataArray([..._int8data]);
        requestAnimationFrame(report);
      };
      report();
      return () => {
        source.disconnect();
        cancelAnimationFrame(report);
      };
    }
  }, [analyser, source]);
  const memoizedDataArray = useMemo(
    () =>
      dataArray.map((e) =>
        roundingStep === 1 ? e : Math.round(e / roundingStep) * roundingStep
      ),
    [dataArray, roundingStep]
  );
  return [memoizedDataArray, mediaDevices];
};

export default useAudioDevices;
