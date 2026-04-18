"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

const URL = "https://teachablemachine.withgoogle.com/models/he9hbp75v/";

export default function WebcamPage() {
  const canvasRef = useRef(null);
  const labelContainerRef = useRef(null);
  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const ctxRef = useRef(null);
  const maxPredictionsRef = useRef(0);
  const animationFrameRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stableLabel, setStableLabel] = useState("");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [confidence, setConfidence] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [currentLabel, setCurrentLabel] = useState("");

  const bufferRef = useRef([]);
  const lastStableRef = useRef("");
  let lastRun = 0;
  const INTERVAL = 400;
  const BUFFER_SIZE = 8;

  // تحميل المكتبات والموديل
  useEffect(() => {
    const loadLibraries = async () => {
      // تحميل TensorFlow
      if (!window.tf) {
        const tfScript = document.createElement("script");
        tfScript.src =
          "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js";
        tfScript.async = true;
        document.head.appendChild(tfScript);
      }

      // تحميل Teachable Machine Pose
      if (!window.tmPose) {
        const tmScript = document.createElement("script");
        tmScript.src =
          "https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js";
        tmScript.async = true;
        tmScript.onload = () => {
          initializeModel();
        };
        document.head.appendChild(tmScript);
      } else {
        initializeModel();
      }
    };

    const initializeModel = async () => {
      try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        const model = await window.tmPose.load(modelURL, metadataURL);
        modelRef.current = model;
        maxPredictionsRef.current = model.getTotalClasses();
        setLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
        setLoading(false);
      }
    };

    loadLibraries();
  }, []);

  // تشغيل الكاميرا والتنبؤ
  useEffect(() => {
    if (!cameraActive || !modelRef.current) return;

    let webcam;

    const initCamera = async () => {
      try {
        const size = 600;
        const flip = true;

        webcam = new window.tmPose.Webcam(size, size, flip);
        webcamRef.current = webcam;

        await webcam.setup();
        await webcam.play();

        const canvas = canvasRef.current;
        canvas.width = size;
        canvas.height = size;
        ctxRef.current = canvas.getContext("2d");

        loop();
      } catch (error) {
        console.error("Error initializing camera:", error);
      }
    };

    const getStableResult = (arr) => {
      if (arr.length === 0) return null;
      const map = {};
      arr.forEach((v) => {
        map[v] = (map[v] || 0) + 1;
      });
      const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
      const topResult = sorted[0];
      if (topResult && topResult[1] >= Math.ceil(BUFFER_SIZE * 0.6)) {
        return topResult[0];
      }
      return null;
    };

    const loop = async () => {
      const now = Date.now();

      if (now - lastRun >= INTERVAL && webcamRef.current) {
        lastRun = now;
        await predict();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    const predict = async () => {
      if (!webcamRef.current || !modelRef.current || !ctxRef.current) return;

      webcamRef.current.update();

      const { pose, posenetOutput } = await modelRef.current.estimatePose(
        webcamRef.current.canvas,
      );
      const prediction = await modelRef.current.predict(posenetOutput);

      // البحث عن أفضل نتيجة
      const best = prediction.reduce((a, b) =>
        a.probability > b.probability ? a : b,
      );

      if (best.probability < 0.85) {
        drawPose(pose);
        return;
      }

      // تحديث الثقة والتسمية
      setConfidence(best.probability);
      setCurrentLabel(
        `${best.className}: ${(best.probability * 100).toFixed(1)}%`,
      );

      // تحديث التنبؤات لعرضها
      const predictionsArray = prediction.map((p) => ({
        className: p.className,
        probability: p.probability,
      }));
      setPredictions(predictionsArray);

      // إضافة النتيجة إلى المخزن المؤقت
      bufferRef.current.push(best.className);
      if (bufferRef.current.length > BUFFER_SIZE) {
        bufferRef.current.shift();
      }

      // التحقق من الاستقرار
      if (bufferRef.current.length === BUFFER_SIZE) {
        const stable = getStableResult(bufferRef.current);
        if (stable && stable !== lastStableRef.current) {
          lastStableRef.current = stable;
          setStableLabel(stable);

          const newItem = {
            id: Date.now(),
            label: stable,
            timestamp: new Date().toLocaleTimeString("ar-EG"),
            confidence: best.probability,
          };

          setHistory((prev) => [newItem, ...prev]);

          // تحديث الإحصائيات
          setStats((prev) => ({
            ...prev,
            [stable]: (prev[stable] || 0) + 1,
          }));
        }
      }

      // رسم الكاميرا مع نقاط keypoints والهيكل العظمي
      drawPose(pose);
    };

    const drawPose = (pose) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (webcamRef.current && canvas && ctx) {
        ctx.drawImage(
          webcamRef.current.canvas,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        // رسم نقاط keypoints والهيكل العظمي
        if (pose) {
          const minPartConfidence = 0.5;
          window.tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
          window.tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
      }
    };

    initCamera();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive]);

  const clearHistory = () => {
    setHistory([]);
    setStats({});
  };

  // أكثر النتائج شيوعاً
  const topResults = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalDetections = history.length;
  const avgConfidence =
    history.length > 0
      ? (
          (history.reduce((sum, item) => sum + item.confidence, 0) /
            history.length) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-sky-300 border-t-sky-600"
            />
            <div className="text-center space-y-2">
              <p className="text-gray-800 font-semibold">جاري تحميل النموذج...</p>
              <p className="text-sky-600 text-sm">يرجى الانتظار قليلاً</p>
            </div>
          </motion.div>
        </div>
      ) : (
        <div>
        <Header title={"تحليل الكاميرا"} description={"شاهد تحليلات الكاميرا الحية وتاريخ النتائج"} />  
        <div className="min-h-screen pt-20  flex flex-col">
          {/* Header */}

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8 max-w-[92%] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
              {/* Camera Feed - Left Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 flex flex-col gap-4"
              >
                {/* Camera Container */}
                <div className="flex-1 rounded-3xl border border-sky-200 bg-white shadow-2xl overflow-hidden backdrop-blur-sm">
                  <div className="relative w-full h-full bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center overflow-hidden">
                    {cameraActive ? (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          className="block w-full h-full object-contain"
                        />

                        {/* Live Indicator */}
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute top-4 right-4 z-10"
                        >
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-full backdrop-blur-md shadow-lg">
                            <motion.div
                              animate={{
                                opacity: [1, 0.5, 1],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-2.5 h-2.5 bg-white rounded-full"
                            />
                            <span className="text-xs font-bold tracking-wider">
                              LIVE
                            </span>
                          </div>
                        </motion.div>

                        {/* Confidence Bar */}
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                          <div className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-sky-200 shadow-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-sky-700">
                                  مستوى الثقة
                                </span>
                                <span className="text-xs font-bold text-sky-600">
                                  {(confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${confidence * 100}%` }}
                                  transition={{ duration: 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-6"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-sky-200 mx-auto flex items-center justify-center bg-sky-50"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-transparent border-t-sky-600 border-r-blue-500"
                          />
                        </motion.div>
                        <div>
                          <p className="text-gray-800 text-lg font-semibold mb-2">
                            جاهز للتحليل
                          </p>
                          <p className="text-sky-600 text-sm">
                            اضغط على "تشغيل الكاميرا" للبدء
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Predictions Display */}
                {cameraActive && predictions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/60 to-blue-50/40 shadow-xl backdrop-blur-sm p-4"
                  >
                    <h3 className="text-sm font-semibold text-sky-700 uppercase tracking-wider mb-3">
                      جميع التنبؤات
                    </h3>
                    <div className="space-y-2">
                      {predictions.map((pred, idx) => (
                        <motion.div
                          key={pred.className}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-2 rounded-lg bg-sky-100/40 border border-sky-200"
                        >
                          <span className="text-sm text-gray-700">
                            {pred.className}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-sky-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-sky-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${pred.probability * 100}%`,
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <span className="text-xs font-bold text-sky-600 w-10 text-right">
                              {(pred.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Controls */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setCameraActive(!cameraActive)}
                    className={`flex-1 h-12 rounded-xl font-semibold text-base transition-all duration-300 text-white ${
                      cameraActive
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50"
                        : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-600/50"
                    }`}
                  >
                    {cameraActive ? "⏹ إيقاف الكاميرا" : "▶ تشغيل الكاميرا"}
                  </Button>
                </div>
              </motion.div>

              {/* Right Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-4 lg:h-[calc(100vh-180px)]"
              >
                {/* Current Result */}
                <motion.div
                  className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/60 to-blue-50/40 shadow-xl backdrop-blur-sm overflow-hidden"
                  layout
                >
                  <div className="p-4 border-b border-sky-200 bg-white/50">
                    <h2 className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
                      النتيجة المستقرة
                    </h2>
                  </div>

                  <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                    <AnimatePresence mode="wait">
                      {stableLabel && cameraActive ? (
                        <motion.div
                          key={stableLabel}
                          initial={{ scale: 0.8, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full text-center space-y-4"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-sky-100/50 to-blue-100/50 border-2 border-sky-400"
                          >
                            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                              {stableLabel}
                            </p>
                          </motion.div>

                          <div className="text-sm space-y-2">
                            <p className="flex items-center gap-2 text-gray-700">
                              <span className="inline-block w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                              {currentLabel}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center space-y-3"
                        >
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-sky-600"
                          >
                            في انتظار نتيجة مستقرة...
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Statistics */}
                

                  {/* Top Results */}
               

                {/* History */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/60 to-blue-50/40 shadow-xl backdrop-blur-sm overflow-hidden flex-1 flex flex-col"
                >
                  <div className="p-4 border-b border-sky-200 bg-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <h2 className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
                        السجل الأخير
                      </h2>
                    </div>
                    {history.length > 0 && (
                      <Button
                        onClick={clearHistory}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <AnimatePresence>
                      {history.length > 0 ? (
                        history.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 rounded-lg bg-sky-100/40 border border-sky-200 hover:border-sky-400 hover:bg-sky-100/60 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm truncate">
                                  {index + 1}. {item.label}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {item.timestamp}
                                </p>
                              </div>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-xs font-bold text-sky-700 bg-sky-200/60 px-2 py-1 rounded whitespace-nowrap"
                              >
                                {(item.confidence * 100).toFixed(0)}%
                              </motion.div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center h-full text-gray-500 text-sm"
                        >
                          لا توجد نتائج بعد
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                
              </motion.div>
              {/*------ */}
               {topResults.length > 0 && (
                <div>
                  <motion.div
                  
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[400px] rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/60 to-blue-50/40 shadow-xl backdrop-blur-sm overflow-hidden flex-1 flex flex-col"
                  >
                    <div className="p-4 border-b border-sky-200 bg-white/50">
                      <h2 className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
                        أكثر النتائج شيوعاً
                      </h2>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto flex-1">
                      {topResults.map(([label, count], index) => (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 rounded-xl bg-sky-100/40 border border-sky-200 hover:border-sky-400 hover:bg-sky-100/60 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-sky-700 bg-sky-200/60 px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                              <p className="font-semibold text-gray-800">
                                {label}
                              </p>
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="text-xs font-bold text-sky-700 bg-sky-200/60 px-2 py-1 rounded"
                            >
                              {count}x
                            </motion.div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-2 h-1.5 bg-sky-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(count / topResults[0][1]) * 100}%`,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {totalDetections > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="  mt-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/60 to-blue-50/40 shadow-xl backdrop-blur-sm overflow-hidden"
                  >
                    <div className="p-4 border-b border-sky-200 bg-white/50 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      <h2 className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
                        الإحصائيات
                      </h2>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          إجمالي الكشف
                        </p>
                        <p className="text-2xl font-bold text-sky-600">
                          {totalDetections}
                        </p>
                      </div>

                      <div className="h-px bg-sky-200" />

                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          متوسط الثقة
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold text-blue-600">
                            {avgConfidence}%
                          </p>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-lg"
                          >
                            ✨
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                  </div>
                )}
              
            </div>


          </div>
        </div>
        <Footer/>

        </div>
      )}
    </div>
    
  );
}