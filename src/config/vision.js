import "dotenv/config";

let rtspUrl, visionServiceUrl;

if (process.env.NODE_ENV === "production") {
  rtspUrl = "rtsp://rahasia:Rahasia123@192.168.133.13:554/stream1";
  visionServiceUrl = "vision.plnnusantarapower.co.id/detect";
} else {
  rtspUrl = process.env.RTSP_URL;
  visionServiceUrl = process.env.VISION_SERVICE_URL;
}

export { rtspUrl, visionServiceUrl };
