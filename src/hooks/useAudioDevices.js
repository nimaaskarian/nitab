import { useEffect, useMemo, useState } from "react";

const useAudioDevices = (frequencyBinCount = 128, deviceId) => {
  const [mediaDevices, setMediaDevices] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [source, setSource] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  const [dataInt8Array, setDataInt8Array] = useState(
    new Uint8Array(frequencyBinCount)
  );

  // const stopMediaRecorder = () => {
  //   mediaRecorder.stop();
  //   mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  // };
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
      mediaRecorder.start();
      setSource(audioContext.createMediaStreamSource(mediaRecorder.stream));
      mediaRecorder.ondataavailable = (event) => {
        console.log(event.data);
      };
    }
  }, [audioContext, mediaRecorder]);
  useEffect(() => {
    if (analyser) analyser.fftSize = frequencyBinCount;
  }, [analyser, frequencyBinCount]);

  useEffect(() => {
    console.log(analyser, source);
    if (source && analyser) {
      source.connect(analyser);
      const report = () => {
        const _int8data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(_int8data);
        setDataInt8Array(_int8data);
        requestAnimationFrame(report);
      };
      report();
    }
  }, [analyser, source]);
  return dataInt8Array;
};

export default useAudioDevices;
