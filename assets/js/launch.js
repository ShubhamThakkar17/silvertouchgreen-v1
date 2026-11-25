/* Silver Touch Green RE: BESS assembly launch (Dholera, Gujarat, 2027)
   1. Hero sunset: the sun sets, night falls, battery storage lights the
      landscape and the launch card pops up from where the sun went down.
   2. Dholera motion graphic: Gujarat map -> Dholera pin -> BESS container
      dissected into shell, racks, modules and cells -> reassembled.
      data-dholera="scroll" scrubs with a scroll story; "loop" autoplays.
   Map outline: Gujarat and neighbouring states from @svg-maps/india
   (CC BY 4.0, https://github.com/VictorCazanave/svg-maps), simplified. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!window.gsap;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ------------------------------------------------------------------
     Geography (map units: Gujarat spans x 0..132, y 3..107)
     ------------------------------------------------------------------ */
  var GEO = {"gj":"M30.2 54.3 30.8 55 30.4 55.5 29.3 54.8ZM19.9 53.9 20.1 54.2 18.8 55.2 19 54.3ZM38.2 51.3 38.5 51.9 37.1 52.3 37.2 51.6ZM7.8 34.9 8.9 35.3 9 35.8 8.1 36.1 8.1 36.4 7.4 35.8 8 35.6ZM8.4 33.5 9 34 9 34.6 8.2 34 8 33.5ZM6 31.1 6.5 31.6 6.2 32.8 5.7 32.5 5.8 31.7 4.9 32.4 4.7 32.2ZM6.2 28.4 6.2 29.2 5.1 30.4 5.2 29.3ZM3.6 23.6 4.4 24.1 5 23.9 4.3 27.1 2.7 28.7 1.8 28.5 2.2 28.3 1.8 27.9 1.2 28.2 1.3 28.5 0.7 28.6 0.8 28.2 0.2 28.4 0 27.8 0.4 27.2 1.7 27.2 3 25.5ZM2.8 23.8 2.9 25.3 2 25.9 2 24ZM6.5 23 6.9 24.8 5.3 25.1 5.7 24.4 5.5 23.6ZM4.2 22.3 4.7 22.3 5 23.5 3.8 23.4 3.6 22.9ZM5.4 20.7 5.4 22.1 4 22 3.4 22.7 3.5 21.6ZM7.2 20.6 8.3 21.2 6.9 22.5 6.4 22.2 6.4 21.7 7.4 21.1ZM6.2 19.3 7 20.9 5.4 22.6 5.9 20.7 5.6 20.4 5.1 20.6 5.5 19.6ZM5.1 19.3 4.7 20.7 3.3 21.4 3.2 23.3 2.8 23.6 2.5 23.2 1.7 23.9 1.7 26.2 1.1 26.5 0.1 25.3 1 24.3 0.6 23 1 22.9 1.9 21.1 3.1 21.1 3.6 19.7 4.4 20ZM61.1 3.5 65.1 5.2 66.2 4.1 66.9 4.9 69.1 3.7 71.8 3.7 72.7 4.6 75.6 3.7 75.9 4.9 76.9 5.3 77.2 3.6 78.2 3.8 78.7 4.7 80.9 2.9 81.6 3.1 81.6 4.1 83.3 5 84.2 5.1 84.6 4.6 86.4 5.2 87.2 4.9 86.7 5.7 85.7 5.4 85.1 5.8 86 6.8 87.3 6.5 87.9 7.7 89.1 7.6 89 8.6 89.6 9.8 90.5 9.7 90.3 8.8 91.2 7.5 92.2 8.3 94.4 8.7 94.4 9.5 95.2 10.9 98 10.8 99.2 11.7 100.6 10.8 100 10.3 100.8 8.3 101 8.1 101.8 8.5 102.7 7.8 103 9.4 102.5 10.1 104.3 11.1 105.2 10.5 105.6 10.8 105.2 11.5 104.8 11.3 104.5 12.2 103.8 12.1 102.5 14.9 103.2 16 105.5 16.9 104.9 18 105.9 18.9 106.9 18.5 107.7 17.5 107.8 16.5 108.6 16.2 108.5 17.1 109.4 18 109.2 19.4 109.7 20.7 108.3 22.3 108.4 24 108.6 24.5 109.6 24.2 110.8 25.8 111.4 26 111.5 28 112.9 27.1 114.6 27.8 114.1 29.5 114.5 30.5 114 31.7 114.4 32 115.5 31.6 116 32.6 116.8 31.6 117.2 32.1 118.2 31.8 119.5 34.3 120.4 34.2 120.6 33.5 121.1 33.4 121.5 34.3 122.4 34.5 122.6 35.3 123.8 35.3 124.5 35.9 124.4 38 125.5 38.6 126 37.7 126.9 37.7 127.7 39.3 127.6 39.9 128.5 40.6 129.5 42.5 128.9 42.8 129.3 43.6 130.1 44.3 131.2 43.8 131.7 45.3 130.1 48.2 129.7 50.1 127.3 50.1 124.9 53 123.1 52.3 122.4 53.2 122.6 53.6 123.5 53.2 123.3 54.2 123.9 54.1 124.3 55.2 124.7 54.4 125.1 54.9 125.6 54.7 125.7 53.9 126 54.8 127 54.9 127.9 55.8 127.1 55.7 126.5 56.6 126 56.4 125.7 57.4 124.5 57.2 124 56.3 123.2 56.6 122.9 58.3 123.6 59.2 123.3 59.7 124.3 59.9 124.4 62.5 124.9 62.3 125.5 62.8 123.7 64.4 124.9 65 124.8 65.8 117.7 68.7 118.5 69.5 118.2 70.1 119.5 71.5 119.3 72.8 117.3 73.2 118 73.8 118.8 76.1 123.2 74.7 125.6 74.7 126.1 75.3 126.7 74.9 127.4 75.2 128.1 74.6 128.6 75.1 128.6 76.1 126.9 76.9 126.5 76.5 126.4 76.9 124.4 76.8 124 77.2 123.1 76.4 122.7 77.8 121 78.5 120.7 78.2 120.6 80.6 119.4 81.4 118.2 81.3 118 83.4 116.3 83.5 116.2 84.2 115 83.9 114.1 84.3 113.6 83.3 113.1 83.5 114.6 84.8 116.5 84.7 116.3 86 117 87 117.7 86.8 117.9 87.4 119.7 87.7 119.5 88.6 120.5 90.9 120.6 93.1 120 93.5 119.3 93.3 118.8 94.1 118 94.1 118.5 94.7 118.3 95.9 116.4 97 115.4 96.7 114.8 97.1 114.1 96.7 113.5 95.4 112 94.6 111.2 95 110.9 93.6 110.3 93.8 110 94.8 109.2 95.3 110 96.4 110.8 96.6 110.9 97.5 111.2 97.6 109.8 100.4 109 100.9 109.6 101.8 109.8 105.1 108.6 105.4 108.5 104.9 108.2 105.2 107.3 105 106.8 106.3 105.3 106.9 104.9 106.5 105.5 105.6 105.2 105.3 103.8 105 103.9 105.8 103.4 106.2 102.7 105.8 102.5 106.2 102.4 104.5 103.1 104.5 104.1 103.2 104.5 103.3 104.1 102.6 103.1 102.8 103 101.6 102.7 102.4 101.8 102.4 101.7 103.2 101.2 102.6 101.2 103.2 100.6 103.1 100.4 103.6 99.6 103.1 99.2 103.4 100.1 104.9 98.1 104.6 97.3 105.5 97.3 106.4 96.6 106.3 96.6 106.9 95.3 106.6 95.7 103.1 97 101.4 98.4 98.5 98.6 96.5 96.4 89.6 96.4 88.5 96 88.7 95 86.2 96 85.8 94.6 85.6 94.9 84.1 93.8 83.8 93.6 85.3 93 85.6 92.8 82.3 92.1 80.7 92.9 78.7 94.4 76.8 93.3 77.5 93.9 75.6 94.6 75.3 94.1 75.1 92.9 76.2 92.3 74.8 93 73.4 94.5 72.6 96.3 72.8 97.3 72.2 96.2 72.3 95.2 71.8 91.1 72.3 90.5 71.5 91.1 70.7 91.8 68.7 90.7 68 90.3 65.8 91.3 61.3 92 60.2 93.4 59.8 95.6 60.8 96.8 59.2 98.2 59.7 98.7 59.4 99 58.4 98.6 59.2 98 59.2 97.5 58.3 95.6 59.5 94.2 59.3 93.1 58.3 91.2 59.2 91.1 58.5 90 60.3 90.1 59.4 89.7 59.3 88.9 57.9 88.1 57.5 88.5 56.6 87.8 56 87.4 56.3 88.1 56.8 87.6 57.7 88.5 58 88.6 59.6 88.2 60.2 87.3 58.6 87.4 60.1 88 60.9 87.7 61.3 87.3 60.6 87 61.9 86.6 61.8 85.7 66.3 84.9 63.6 85.8 63.1 86.1 63.3 86.1 62.3 84.7 63.5 84.4 65.9 85.1 67 85.4 70.6 86.2 73.1 84.5 77.4 82.5 79.8 82.1 80.9 81.4 80.5 81.9 81.1 81.6 81.7 82.2 82.9 80.2 83.8 80 84.3 80.1 83.1 79.3 84.6 76.1 85.7 75.6 86 75.8 86.4 73.9 86.8 70.7 88.4 69.7 88.4 69.7 89 68.1 90.2 66.8 90.1 67 90.5 63.3 91.7 62.2 92.2 62 92.7 60.8 92.7 60.5 93.2 58.1 93.1 56.6 93.8 55.7 92.6 56.1 92.6 56.1 91.9 56.7 91.9 56.7 91.2 55.1 90.6 56.8 89.8 56.5 88.5 55.7 87.9 54.1 88.1 53.5 87.5 52.2 90.8 52.1 92.6 50.8 92.4 47.2 90.6 40.1 84.9 32 75.4 33 74.3 32.5 72.6 32.2 73 31.2 72.9 32.1 73.7 31.6 73.9 32.2 74.4 31.8 75.1 21.9 66 16.1 59.4 15.7 57.7 16.7 55.4 18.4 53.9 18.8 54 18 54.9 18.5 55.8 21.1 55.1 21.3 55.6 20.3 57.6 21.9 58.9 23.7 58.1 24 57.3 25.8 57.6 27.2 57.1 28 56 27.5 54.9 28.6 55.6 28.8 56.7 30.7 56.6 30.9 55.8 31.7 55.8 31.6 54.7 31.1 54.5 32.3 54 32.6 55 32.9 54.7 33.7 55.7 34.5 54.4 35.3 54.6 36.5 53.2 37.1 53.5 37 52.7 38.8 52 39.3 52.3 41.4 52.2 43.1 49.7 43.3 48.1 44.3 47.6 45.4 45 46.8 43.6 48.3 40.3 47.1 40.6 46.4 41.3 46.1 43.2 45.2 43.6 42.9 42.5 42.6 43 41.4 43.3 40.6 42.9 40.7 43.8 33.8 45.4 32.8 46.1 31.8 47.9 30.5 47.4 29.6 47.5 28.6 46.8 26.9 47.2 24.5 45.9 21.2 45.7 13.2 40.5 12 40.2 8.5 37.2 8.3 36.7 10.2 35.9 9.5 36 9.4 34.1 8.8 33.3 7.8 33.2 7.8 32.5 7.3 32.4 6.6 31.4 6.3 27.6 6.6 27 7 27.1 7.1 26.3 9.3 24.7 10 23.6 11.5 22.8 11.1 22.4 8.8 22.9 7.1 24.7 6.9 23.2 7.5 22.9 8.1 21.9 10 21.1 9.1 21.1 8.6 20.5 8.4 20.9 7.8 20.9 7.3 20.4 7.5 20 11.8 20 12.3 12.4 13.4 12.1 13.8 14.4 14.7 14.7 15.9 12.8 17 14 19 13 21.2 13.8 23.5 12.8 27.5 13.3 29.6 12.8 32.2 15.1 38 15.3 39.2 14.7 40.5 12.5 50 9.5 50.8 10 49.9 11.2 50.3 12 50 13.4 51.7 14 54.8 14 56.7 13.3 56.5 12.5 58.1 11.2 58.9 10.9 59.9 11.2 61.7 9.9 61.4 9.3 59.1 9 59.2 7.1 58.9 6.7 59.3 4.7Z","rj":"M160 -14 160 22 158.9 22.5 158.3 21.7 157.3 21.4 157.2 22 157.9 22.4 157.7 23.3 157 23.3 157 24.7 156.3 23.7 154.8 23.7 154.3 23.2 154.7 22.8 154.4 22.4 152.2 21 152.4 19.6 153.4 18 154.9 19.4 155.9 19.2 156.6 18.4 157.3 19.9 158.6 19.2 159 17.7 160 17.5 160 16.6 159.2 16.6 158.9 16 158.2 16 158.8 14.1 159.9 13.5 159.6 12.2 158.7 12 158.1 11.2 157.9 9.8 158.4 9.8 158.3 9.3 159.2 8.2 160 9.1 160 5.1 160 5.1 160 5 160 3.8 159.9 3.7 160 3.4 160 2.3 158.5 1.6 155.5 3.3 154.8 2.5 152.1 3.2 148.2 2.3 147.2 2.5 146.5 1.5 147 0.5 147.9 -0.1 146.8 -1.2 147 -1.8 147.3 -1.3 147.9 -1.5 147.4 -0.6 148.5 -0.5 149 0.4 151.4 -0.7 151.5 -1.4 149.5 -1.3 149.2 -0.9 148.1 -1.3 148.8 -2.1 148.4 -3.3 149.2 -1.6 149.7 -3 149.3 -4 150 -4.5 149.9 -4.9 146 -4.9 146.1 -3.7 145.1 -3.1 145.1 -1.3 143.8 -1.2 143.5 -0.6 141 -1.4 140.8 -2.2 140.2 -2.7 139.9 -2.4 139.4 -3.3 138.9 -2.2 139.6 -0.5 139.5 0.9 139.7 0.4 140.9 1 142.8 0.8 143.1 1.8 142.5 1.8 142.6 2.9 141.8 3 141.4 4 140.4 4.1 138.4 0.8 137.9 3.3 138.8 3.7 138.1 4.5 138.2 5.1 137.4 5.4 137.5 6.4 136.6 7.4 138 8 138.8 7.9 138.8 8.5 139.7 8.4 138.2 10.6 138.1 11.9 137.5 12.7 139.9 12.7 140.4 13.2 140.7 13.8 140.1 14.3 142.5 18.5 141 20.6 140.7 22.1 141.4 25.2 140.7 26.4 141.4 27.6 140.7 27.8 139.4 29.4 138.5 29.8 138.1 29.5 137.1 30.6 136.4 30.5 135.4 31.4 134.5 31.5 133.7 32.4 133.6 33.4 132.6 34.5 133.3 35.6 133.7 35.2 135.2 36.1 136.4 35.8 136.8 36.5 136.2 37 137.3 36.7 137.3 37.2 135.7 37.4 134.4 38.7 133.1 39 132.4 40 129.9 39.5 128.5 40.6 127.6 39.9 126.9 37.7 126 37.7 125.5 38.6 124.4 38 124.5 35.9 123.8 35.3 122.6 35.3 122.4 34.5 121.5 34.3 121.1 33.4 120.6 33.5 120.4 34.2 119.5 34.3 118.2 31.8 117.2 32.1 116.8 31.6 116 32.6 115.5 31.6 114 31.7 114.6 30.5 114.1 29.5 114.6 27.8 112.9 27.1 111.5 28 111.4 26 110.8 25.8 109.6 24.2 108.6 24.5 108.4 24 108.3 22.3 109.7 20.7 109.4 18 108.5 17.1 108.6 16.2 107.8 16.5 107.7 17.5 106.9 18.5 105.9 18.9 104.9 18 105.5 16.9 103.2 16 102.5 14.9 103.8 12.1 104.5 12.2 104.8 11.3 105.2 11.5 105.6 10.8 105.2 10.5 104.3 11.1 102.5 10.1 103 9.4 102.7 7.8 101.8 8.5 100.8 8.3 100 10.3 100.6 10.8 99.2 11.7 98 10.8 95.2 10.9 94.4 9.5 94.4 8.7 92.2 8.3 91.2 7.5 90.3 8.8 90.5 9.7 89.6 9.8 89 8.6 89.1 7.6 88 7.7 87.3 6.5 86 6.8 85.1 5.8 85.7 5.4 86.7 5.7 87.2 4.9 86.4 5.2 84.6 4.6 84.2 5.1 83.3 5 81.6 4.1 81.6 3.1 80.9 2.9 78.7 4.7 78.2 3.8 77.2 3.6 76.9 5.3 75.9 4.9 75.6 3.7 72.7 4.6 71.8 3.7 69.1 3.7 66.9 4.9 66.2 4.1 65.1 5.2 61.1 3.5 57.8 -2.4 56.7 -7.2 54 -10 53.5 -11.3 52.1 -12.9 52.2 -14Z","mp":"M160 78.4 156.7 78.7 155.4 78.4 154.1 78.9 152.4 78.4 151 78.7 150.2 78.2 149 78.5 148.9 77.9 147.2 78 145 76.9 143.8 74.6 140.6 73.1 138.3 73.5 133.4 71.9 133.3 71.1 132.4 70.9 132.2 69.1 132.7 66.8 132 65.8 131.1 65.4 131 64.1 129.8 64.3 129.1 65.2 128 65.5 127.8 66.2 125.9 66.4 124.8 65.8 124.9 65 123.7 64.4 125.5 62.8 124.4 62.5 124.3 59.9 123.3 59.7 123.6 59.2 122.9 58.3 123.2 56.6 124 56.3 124.5 57.2 125.7 57.4 126 56.4 126.5 56.6 127.1 55.7 127.9 55.8 127 54.9 126 54.8 125.7 53.9 125.6 54.7 125.1 54.9 124.7 54.4 124.3 55.2 123.9 54.1 123.3 54.2 123.5 53.2 122.6 53.6 122.4 53.2 123.1 52.3 124.9 53 127.3 50.1 129.7 50.1 130.1 48.2 131.7 45.3 131.2 43.8 130.1 44.3 129.3 43.6 128.9 42.8 129.5 42.5 128.5 40.6 129.9 39.5 132.4 40 133.1 39 134.4 38.7 135.7 37.4 137.3 37.2 137.3 36.7 136.2 37 136.8 36.5 136.4 35.8 135.2 36.1 133.7 35.2 133.3 35.6 132.5 34.5 133.6 33.4 133.7 32.4 134.5 31.5 135.4 31.4 136.4 30.5 137.1 30.6 138.1 29.5 138.5 29.8 139.4 29.4 140.7 27.8 141.4 27.6 140.7 26.4 141.4 25.2 140.7 22.1 141 20.6 142.5 18.5 140.1 14.3 140.7 13.8 140.4 13.2 139.9 12.7 137.5 12.7 138.1 11.9 138.2 10.6 139.7 8.4 138.8 8.5 138.8 7.9 138 8 136.6 7.4 137.5 6.4 137.4 5.4 138.2 5.1 138.1 4.5 138.8 3.7 137.9 3.3 138.4 0.8 140.4 4.1 141.4 4 141.8 3 142.6 2.9 142.5 1.8 143.1 1.8 142.8 0.8 140.9 1 139.7 0.4 139.5 0.9 139.6 -0.5 138.9 -2.2 139.4 -3.3 139.9 -2.4 140.2 -2.7 140.8 -2.2 141 -1.4 143.5 -0.6 143.8 -1.2 145.1 -1.3 145.1 -3.1 146.1 -3.7 146 -4.9 149.9 -4.9 150 -4.5 149.3 -4 149.7 -3 149.2 -1.6 148.4 -3.3 148.8 -2.1 148.1 -1.3 149.1 -0.9 149.5 -1.3 151.5 -1.4 151.4 -0.7 149 0.4 148.5 -0.5 147.4 -0.6 147.9 -1.5 147.3 -1.3 147 -1.8 146.8 -1.2 147.9 -0.1 147 0.5 146.5 1.5 147.2 2.5 148.2 2.3 152.1 3.2 154.8 2.5 155.5 3.3 158.5 1.6 160 2.3 160 3.4 159.9 3.7 160 3.8 160 5 160 5.1 160 5.1 160 9.1 159.2 8.2 158.3 9.3 158.4 9.8 157.8 9.8 158.1 11.2 158.6 12 159.6 12.2 159.9 13.5 158.8 14.1 158.2 16 158.9 16 159.2 16.6 160 16.6 160 17.5 159 17.7 158.6 19.2 157.3 19.9 156.6 18.4 155.9 19.2 154.9 19.4 153.4 18 152.4 19.6 152.2 21 154.4 22.4 154.7 22.8 154.3 23.2 154.8 23.7 156.3 23.7 157 24.7 157 23.3 157.7 23.3 157.9 22.4 157.2 22 157.3 21.4 158.3 21.7 158.9 22.5 160 22Z","mh":"M124.8 65.8 125.9 66.4 127.8 66.2 128 65.5 129.1 65.2 129.8 64.3 131 64.1 131.1 65.4 132 65.8 132.7 66.8 132.2 69.1 132.4 70.9 133.3 71.1 133.4 71.9 138.3 73.5 140.6 73.1 143.8 74.6 145 76.9 147.2 78 148.9 77.9 149 78.5 150.2 78.2 151 78.7 152.4 78.4 154.1 78.9 155.4 78.4 156.7 78.7 160 78.4 160 128 96.2 128 96.1 125.7 96.6 124.5 95.7 123.5 95.4 121.6 96.3 120.2 95.8 120.7 94.9 119.9 94.8 118.7 95.3 118.6 93.5 112.8 94.1 112.7 93.7 111.1 94.8 110.3 94.6 108.1 95.3 106.6 96.6 106.9 96.6 106.3 97.3 106.4 97.3 105.5 98.1 104.6 100.1 104.9 100.5 105.8 100.2 106.7 100.5 107.1 101.1 106.6 101 107.2 101.9 108.1 102 107.4 104.7 108.5 105.3 106.9 106.8 106.3 107.3 105 108.5 104.9 108.6 105.3 109.8 105 109.6 101.8 109 100.9 109.8 100.4 111.2 97.6 110.9 97.5 110.8 96.6 110 96.3 109.2 95.3 110 94.8 110.3 93.8 110.9 93.6 111.2 95 112 94.6 113.5 95.4 114.1 96.7 114.8 97.1 115.4 96.7 116.4 97 118.3 95.9 118.5 94.7 118 94.1 118.8 94.1 119.3 93.3 120.6 93 120.5 90.9 119.5 88.6 119.7 87.6 117.9 87.4 117.7 86.8 117 87 116.3 86 116.5 84.7 114.6 84.8 113.1 83.5 113.6 83.3 114.1 84.3 115 83.8 116.2 84.2 116.3 83.5 118 83.4 118.2 81.3 119.4 81.4 120.6 80.6 120.7 78.2 122.7 77.8 123.1 76.4 124 77.2 124.4 76.8 126.4 76.9 126.5 76.5 126.9 76.9 128.6 76.1 128.6 75.1 128.1 74.5 127.4 75.2 126.7 74.9 126.1 75.3 125.6 74.7 123.2 74.7 118.8 76.1 118 73.8 117.3 73.2 119.3 72.7 119.5 71.5 118.2 70.1 118.5 69.5 117.7 68.7Z","dd":"M52.1 92.6 52.2 90.8 53.5 87.5 54.1 88.1 55.7 87.9 56.5 88.5 56.8 89.8 55.1 90.6 56.7 91.2 56.7 91.9 56.1 91.9 56.1 92.6 55.7 92.6 56.6 93.8 56.2 93.6 56.3 93.9 55.2 94.2Z","dn":"M105.3 106.9 104.7 108.5 103.7 107.8 102 107.4 101.9 108.1 101 107.2 101.1 106.6 100.5 107.1 100.2 106.7 100.5 105.8 100.1 104.9 99.2 103.4 99.6 103.1 100.4 103.6 100.6 103.1 101.2 103.2 101.2 102.6 101.7 103.2 101.8 102.4 102.7 102.4 103 101.6 103.1 102.8 104.1 102.6 104.5 103.3 104.1 103.2 103.1 104.5 102.4 104.5 102.5 106.2 102.7 105.8 103.4 106.2 103.9 105.8 103.8 105 105.2 105.2 105.5 105.6 104.9 106.5Z"};
  var DHOLERA = [84, 58.7];
  window.STG_GJ = GEO.gj; // shared with news.js (Watt's Up visuals)
  var CITIES = [
    ["Ahmedabad", 91.9, 41.2, "r"], ["Vadodara", 104.6, 57.3, "r"], ["Surat", 97.3, 83.1, "r"],
    ["Bhavnagar", 84.6, 69.8, "l"], ["Rajkot", 55, 57.5, "l"], ["Jamnagar", 39.6, 53.7, "l"], ["Bhuj", 31.5, 36.2, "r"]
  ];

  /* A small Gujarat glyph with a pulsing Dholera pin (cards, chips) */
  function miniMap(svg) {
    svg.setAttribute("viewBox", "-4 -2 140 112");
    svg.innerHTML =
      '<path class="mm-land" d="' + GEO.gj + '"/>' +
      '<g transform="translate(' + DHOLERA[0] + " " + DHOLERA[1] + ')">' +
      '<circle class="mm-ring" r="5"/><circle class="mm-pin" r="4"/></g>';
  }
  $$("svg[data-gj-mini]").forEach(miniMap);

  /* ------------------------------------------------------------------
     Dholera scene
     ------------------------------------------------------------------ */
  var W = 1000, Hh = 620;
  // Isometric projection for the container act
  var S = 40, OX = 336, OY = 232;
  function P(x, y, z) { return [OX + (x - y) * 0.866 * S, OY + (x + y) * 0.5 * S - (z || 0) * S]; }
  function pts(list) { return list.map(function (p) { var q = P(p[0], p[1], p[2]); return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "); }
  // Screen offset of a move in model units
  function V(dx, dy, dz) { return { x: (dx - dy) * 0.866 * S, y: (dx + dy) * 0.5 * S - (dz || 0) * S }; }

  // An isometric box: top, south (+y) and east (+x) faces
  function box(x, y, z, w, d, h, c, extra) {
    var top = pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
    var south = pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);
    var east = pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]);
    return '<polygon class="dh-face" points="' + south + '" fill="' + c[1] + '"/>' +
      '<polygon class="dh-face" points="' + east + '" fill="' + c[2] + '"/>' +
      '<polygon class="dh-face" points="' + top + '" fill="' + c[0] + '"/>' + (extra || "");
  }
  // Matrix that maps flat (u right, v down) drawing onto a face
  function southMatrix(x, y, z) { var o = P(x, y, z); return "matrix(" + 0.866 + " " + 0.5 + " 0 1 " + o[0].toFixed(1) + " " + o[1].toFixed(1) + ")"; }
  function eastMatrix(x, y, z) { var o = P(x, y, z); return "matrix(" + -0.866 + " " + 0.5 + " 0 1 " + o[0].toFixed(1) + " " + o[1].toFixed(1) + ")"; }

  var C_SHELL = ["#e9efe6", "#d3ddd0", "#bccab9"];
  var C_RACK = ["#2f5d3b", "#1c3b24", "#152f1c"];
  var C_MOD = ["#3d754c", "#24492e", "#1b3a23"];
  var C_CELL = ["#ffcf5c", "#ffb100", "#d99400"];
  var C_BOX = ["#dfe7dc", "#c6d2c3", "#adbcaa"];
  var L = 12, D = 2.4, H = 2.6;
  var RACKS = 8, RX0 = 0.95, RW = 1.0, RGAP = 1.17, RY = 0.15, RD = 1.15, RH = 2.2, OUT = 3.7;
  var SPREAD = 0.3, LIFT = 1.05; // exploded module gap and cell lift (model units)
  var MODS = 7, MH = 0.27, MG = 0.04;

  function label(id, text, ax, ay, tx, ty, anchor) {
    var mid = anchor === "end" ? tx + 8 : tx - 8;
    return '<g class="dh-lbl" data-l="' + id + '">' +
      '<path d="M' + ax.toFixed(1) + " " + ay.toFixed(1) + " L" + mid.toFixed(1) + " " + ty + " H" + tx + '"/>' +
      '<circle cx="' + ax.toFixed(1) + '" cy="' + ay.toFixed(1) + '" r="3.5"/>' +
      '<text x="' + (anchor === "end" ? tx - 6 : tx + 6) + '" y="' + (ty + 5) + '" text-anchor="' + (anchor || "start") + '">' + text + "</text></g>";
  }

  var sceneCount = 0;
  function buildScene(svg) {
    svg.setAttribute("viewBox", "0 0 " + W + " " + Hh);
    var o = "";

    /* ---------- Act 1: map ---------- */
    var MS = 4.5, MX = 28, MY = 70;
    var dx = MX + DHOLERA[0] * MS, dy = MY + DHOLERA[1] * MS;
    o += '<g class="dh-map" data-o="' + dx.toFixed(1) + " " + dy.toFixed(1) + '">';
    o += '<g transform="translate(' + MX + " " + MY + ") scale(" + MS + ')">';
    // Neighbouring states fade out towards the edges of the frame
    var fid = "dh-fade-" + (++sceneCount);
    o += '<defs><radialGradient id="' + fid + '-g" cx="0.45" cy="0.45" r="0.6"><stop offset="0.55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>' +
      '<mask id="' + fid + '"><rect x="-12" y="-14" width="172" height="142" fill="url(#' + fid + '-g)"/></mask></defs>';
    o += '<path class="dh-nb" mask="url(#' + fid + ')" d="' + GEO.rj + GEO.mp + GEO.mh + GEO.dn + GEO.dd + '"/>';
    o += '<path class="dh-gj" d="' + GEO.gj + '"/>';
    o += '<path class="dh-gj-line" d="' + GEO.gj + '"/>';
    o += "</g>";
    o += '<text class="dh-sea" x="' + (MX + 12 * MS) + '" y="' + (MY + 92 * MS) + '">Arabian Sea</text>';
    o += '<text class="dh-sea" x="' + (MX + 87 * MS) + '" y="' + (MY + 76 * MS) + '" transform="rotate(-62 ' + (MX + 87 * MS) + " " + (MY + 76 * MS) + ')">Gulf of Khambhat</text>';
    o += '<text class="dh-region" x="' + (MX + 72 * MS) + '" y="' + (MY + 20 * MS) + '">Gujarat</text>';
    CITIES.forEach(function (c) {
      var x = MX + c[1] * MS, y = MY + c[2] * MS;
      o += '<g class="dh-city"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.2"/>' +
        '<text x="' + (c[3] === "l" ? x - 8 : x + 8).toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="' + (c[3] === "l" ? "end" : "start") + '">' + c[0] + "</text></g>";
    });
    o += '<g class="dh-pin" transform="translate(' + dx.toFixed(1) + " " + dy.toFixed(1) + ')">' +
      '<circle class="dh-ripple" r="10"/><circle class="dh-ripple" r="10" style="animation-delay:-1.1s"/>' +
      '<g class="dh-pin-drop"><path d="M0 0 C -4 -10, -15 -16, -15 -28 A15 15 0 1 1 15 -28 C 15 -16, 4 -10, 0 0 Z"/><circle cx="0" cy="-28" r="5.5"/></g></g>';
    o += "</g>";
    // Location card (right)
    o += '<g class="dh-loc">' +
      '<text class="dh-k" x="660" y="230">Launching 2027</text>' +
      '<text class="dh-big" x="660" y="282">Dholera</text>' +
      '<text class="dh-sub" x="660" y="316">Gujarat, India</text>' +
      '<path class="dh-rule" d="M660 344 H930"/>' +
      '<text class="dh-k2" x="660" y="372">BESS assembly facility</text>' +
      '<text class="dh-k2 dim" x="660" y="396">Ahmedabad district &middot; Gulf of Khambhat</text></g>';

    /* ---------- Act 2: site + container ---------- */
    o += '<g class="dh-site">';
    // plot grid
    var grid = "";
    for (var gx = -3; gx <= 17; gx += 2) grid += "M" + pts([[gx, -3, 0]]) + " L" + pts([[gx, 7, 0]]) + " ";
    for (var gy = -3; gy <= 7; gy += 2) grid += "M" + pts([[-3, gy, 0]]) + " L" + pts([[17, gy, 0]]) + " ";
    o += '<path class="dh-grid" d="' + grid.replace(/,/g, " ") + '"/>';
    o += '<polygon class="dh-pad" points="' + pts([[-0.4, -0.4, 0], [16, -0.4, 0], [16, 2.9, 0], [-0.4, 2.9, 0]]) + '"/>';
    o += '<text class="dh-site-k" x="960" y="44" text-anchor="end">Dholera site &middot; assembly line</text>';
    o += "</g>";

    // Container (built back to front)
    o += '<g class="dh-ctr">';
    o += '<g class="dh-interior">';
    o += '<polygon points="' + pts([[0, 0, 0], [L, 0, 0], [L, D, 0], [0, D, 0]]) + '" fill="#8fa38d"/>';
    o += '<polygon points="' + pts([[0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]]) + '" fill="#cdd8ca"/>';
    o += '<polygon points="' + pts([[0, 0, 0], [0, D, 0], [0, D, H], [0, 0, H]]) + '" fill="#b6c4b3"/>';
    // cable tray along the back wall
    o += '<polyline class="dh-tray" points="' + pts([[0.4, 0.05, 2.38], [11.6, 0.05, 2.38]]) + '"/>';
    o += "</g>";
    // racks
    for (var r = 0; r < RACKS; r++) {
      var rx = RX0 + r * RGAP;
      var mods = "";
      for (var m = 0; m < MODS; m++) {
        var mz = 0.14 + m * (MH + MG);
        mods += '<g transform="' + southMatrix(rx, RY + RD, mz + MH) + '"><rect class="dh-modline" x="2" y="1" width="' + (RW * S - 4).toFixed(1) + '" height="' + (MH * S - 2).toFixed(1) + '" rx="1.5"/>' +
          '<rect class="dh-led" x="' + (RW * S - 9).toFixed(1) + '" y="3" width="4" height="3" rx="1"/></g>';
      }
      o += '<g class="dh-rack' + (r === 3 ? " dh-rack-x" : "") + '">' + box(rx, RY, 0, RW, RD, RH, C_RACK, mods) + "</g>";
    }
    // BMS / control cabinet
    var bx = 10.4;
    o += '<g class="dh-bms">' + box(bx, RY, 0, 0.95, 0.9, 2.05, C_BOX,
      '<g transform="' + southMatrix(bx, RY + 0.9, 1.85) + '"><rect class="dh-screen" x="5" y="2" width="22" height="13" rx="2"/>' +
      '<circle class="dh-blink" cx="9" cy="24" r="2.2"/><circle class="dh-blink b2" cx="16" cy="24" r="2.2"/><circle class="dh-blink b3" cx="23" cy="24" r="2.2"/></g>') + "</g>";
    // Fire suppression cylinder
    var fc = P(0.42, 1.95, 0);
    o += '<g class="dh-fire"><rect x="' + (fc[0] - 7).toFixed(1) + '" y="' + (fc[1] - 52).toFixed(1) + '" width="14" height="52" rx="2" fill="#d4553d"/>' +
      '<ellipse cx="' + fc[0].toFixed(1) + '" cy="' + (fc[1] - 52).toFixed(1) + '" rx="7" ry="3.5" fill="#e98a73"/>' +
      '<rect x="' + (fc[0] - 2.5).toFixed(1) + '" y="' + (fc[1] - 62).toFixed(1) + '" width="5" height="8" fill="#5d6b5c"/></g>';
    // East end wall (doors) + HVAC
    var ew = pts([[L, 0, 0], [L, D, 0], [L, D, H], [L, 0, H]]);
    o += '<g class="dh-end"><polygon class="dh-face" points="' + ew + '" fill="' + C_SHELL[2] + '"/>' +
      '<g transform="' + eastMatrix(L, D, H) + '" class="dh-doors"><path d="M' + (D * S / 2).toFixed(1) + " 6 V" + (H * S - 4).toFixed(1) + " M10 20 V" + (H * S - 18).toFixed(1) + " M" + (D * S - 10).toFixed(1) + " 20 V" + (H * S - 18).toFixed(1) + '"/></g>' +
      "</g>";
    o += '<g class="dh-hvac">' + box(L, 0.55, 1.45, 0.42, 1.3, 0.9, C_BOX,
      '<g transform="' + eastMatrix(L + 0.42, 1.85, 2.35) + '"><circle class="dh-fan-ring" cx="22" cy="15" r="11"/><g class="dh-fan" style="transform-origin:22px 15px"><path d="M22 15 L22 6 M22 15 L30 19 M22 15 L14 19"/></g></g>') + "</g>";
    // Front (south) wall: corrugated, with the brand mark
    var sw = pts([[0, D, 0], [L, D, 0], [L, D, H], [0, D, H]]);
    var corr = "";
    for (var k = 1; k < 36; k++) corr += "M" + (k * L * S / 36).toFixed(1) + " 3 V" + (H * S - 3).toFixed(1) + " ";
    o += '<g class="dh-wall"><polygon class="dh-face" points="' + sw + '" fill="' + C_SHELL[1] + '"/>' +
      '<g transform="' + southMatrix(0, D, H) + '"><path class="dh-corr" d="' + corr + '"/>' +
      '<rect x="0" y="' + (H * S - 12).toFixed(1) + '" width="' + (L * S).toFixed(1) + '" height="6" fill="#ffb100"/>' +
      '<svg x="' + (L * S / 2 - 80).toFixed(1) + '" y="26" width="50" height="30.2" viewBox="0 0 516 312"><use href="#logo-mark"/></svg>' +
      '<text class="dh-ctr-word" x="' + (L * S / 2 - 22).toFixed(1) + '" y="50">BESS</text></g></g>';
    // Roof
    o += '<g class="dh-roof">' + box(0, 0, H, L, D, 0.08, C_SHELL) + "</g>";
    o += "</g>";

    // PCS skid
    o += '<g class="dh-pcs">' + box(13.2, 0.2, 0, 2, 1.7, 1.75, C_BOX,
      '<g transform="' + southMatrix(13.2, 1.9, 1.75) + '"><path class="dh-corr" d="M8 10 H60 M8 18 H60 M8 26 H60 M8 34 H60"/><path class="dh-bolt" d="M40 40 l-6 10 h7 l-6 10"/></g>') +
      '<path class="dh-cable" d="M' + pts([[12, 1.2, 0.3]]).replace(",", " ") + " L" + pts([[13.2, 1.2, 0.3]]).replace(",", " ") + '"/></g>';

    // Exploded rack: sits in rack 3's slot, slides out, splits into modules and cells
    var ex = RX0 + 3 * RGAP;
    o += '<g class="dh-xrack">';
    o += '<g class="dh-xframe">' + box(ex, RY, 0, RW, RD, 0.12, C_RACK) + "</g>";
    for (m = 0; m < MODS; m++) {
      var z0 = 0.14 + m * (MH + MG);
      var cells = "";
      if (m === MODS - 1) {
        for (var c = 0; c < 8; c++) cells += '<g class="dh-cell">' + box(ex + 0.06 + c * 0.112, RY + 0.12, z0 + 0.02, 0.1, RD - 0.24, MH - 0.04, C_CELL) + "</g>";
      }
      o += '<g class="dh-mod" data-m="' + m + '">' + box(ex, RY, z0, RW, RD, MH, C_MOD,
        '<g transform="' + southMatrix(ex, RY + RD, z0 + MH) + '"><rect class="dh-led" x="' + (RW * S - 9).toFixed(1) + '" y="3" width="4" height="3" rx="1"/></g>') +
        (cells ? '<g class="dh-cells">' + cells + "</g>" : "") + "</g>";
    }
    o += "</g>";

    // Labels (exploded positions)
    var out = V(0, OUT, 0);
    var top = 0.14 + (MODS - 1) * (MH + MG + SPREAD);
    var rk = P(ex + 0.5, RY + RD + OUT, 0.6);
    var modAt = P(ex + 0.1, RY + RD + OUT, 0.14 + 4 * (MH + MG + SPREAD) + MH / 2);
    var cellsAt = P(ex + 0.3, RY + 0.6 + OUT, top + LIFT + 0.2);
    var roofAt = P(9, 0.3, H + 0.08);
    var bmsAt = P(bx + 0.5, RY + 0.9, 1.6);
    var hvAt = P(L + 0.42, 1.2, 1.9);
    var fireAt = [fc[0], fc[1] - 24];
    var pcsAt = P(15.2, 1.05, 1.2);
    o += '<g class="dh-labels">' +
      label("roof", "Insulated shell", roofAt[0], roofAt[1] - 120, 700, 150) +
      label("rack", "Battery rack", rk[0], rk[1], 222, 470, "end") +
      label("mods", "Modules", modAt[0], modAt[1], 222, 330, "end") +
      label("cells", "Cells", cellsAt[0], cellsAt[1], 222, 200, "end") +
      label("bms", "BMS", bmsAt[0], bmsAt[1], 830, 236) +
      label("hvac", "HVAC", hvAt[0], hvAt[1], 880, 330) +
      label("fire", "Fire safety", fireAt[0], fireAt[1], 212, 200, "end") +
      label("pcs", "PCS", pcsAt[0], pcsAt[1], 890, 440) +
      "</g>";

    // Assembly stamp
    o += '<g class="dh-stamp" transform="translate(300 585)"><rect x="-150" y="-26" width="300" height="52" rx="26"/>' +
      '<circle cx="-122" cy="0" r="14"/><path d="M-128 0 l4.5 4.5 l8.5 -9" />' +
      '<text x="-98" y="-3">Assembled in Dholera</text><text class="dim" x="-98" y="15">Gujarat, India &middot; 2027</text></g>';

    svg.innerHTML = o;
    return { out: out };
  }

  /* Timeline. Labels mark the five story steps. */
  function sceneTimeline(svg, geo) {
    var q = gsap.utils.selector(svg);
    var line = $(".dh-gj-line", svg);
    var len = 2600;
    try { len = line.getTotalLength() * 4.1; } catch (e) {}
    var map = $(".dh-map", svg);
    var org = map.getAttribute("data-o").split(" ").map(Number);
    var mods = q(".dh-mod");
    var lbl = function (id) { return q('.dh-lbl[data-l="' + id + '"]'); };

    var tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    // Reset (covers the loop restart)
    tl.set(q(".dh-map"), { autoAlpha: 1, scale: 1, x: 0, y: 0, transformOrigin: org[0] + "px " + org[1] + "px" }, 0)
      .set(q(".dh-site, .dh-ctr, .dh-pcs, .dh-xrack, .dh-stamp, .dh-lbl"), { autoAlpha: 0 }, 0);

    // 1. Map: outline draws, cities, the pin drops, location card
    tl.addLabel("s1", 0)
      .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" }, 0)
      .fromTo(q(".dh-gj, .dh-nb"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.5)
      .fromTo(q(".dh-sea, .dh-region"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9)
      .fromTo(q(".dh-city"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, 0.9)
      .fromTo($(".dh-pin-drop", svg), { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out" }, 1.4)
      .fromTo($(".dh-pin", svg), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.4)
      .fromTo(q(".dh-loc > *"), { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 1.7)
      .to({}, { duration: 0.5 }, 2.4);

    // 2. Zoom into Dholera; the site and the container arrive; the shell opens
    tl.addLabel("s2", 2.9)
      .to(q(".dh-loc > *"), { opacity: 0, x: -10, duration: 0.4, stagger: 0.03 }, "s2")
      .to(q(".dh-map"), { scale: 7, duration: 1.1, ease: "power2.in" }, "s2")
      .to(q(".dh-map"), { autoAlpha: 0, duration: 0.5 }, "s2+=0.65")
      .fromTo(q(".dh-site"), { autoAlpha: 0, scale: 1.25, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "s2+=0.8")
      .fromTo(q(".dh-ctr"), { autoAlpha: 0, y: -90 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "s2+=1.25")
      .fromTo(q(".dh-pcs"), { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "s2+=1.5")
      .to(q(".dh-roof"), { y: -120, duration: 0.8 }, "s2+=2.2")
      .to(q(".dh-wall"), { x: geo.out.x * 0.75, y: geo.out.y * 0.75, opacity: 0, duration: 0.8 }, "s2+=2.35")
      .to(lbl("roof"), { autoAlpha: 1, duration: 0.4 }, "s2+=2.9")
      .to({}, { duration: 0.4 }, "s2+=3.3");

    // 3. One rack slides out and splits into modules, the top module into cells
    tl.addLabel("s3", 6.6)
      .to(lbl("roof"), { autoAlpha: 0, duration: 0.3 }, "s3")
      .set(q(".dh-rack-x"), { opacity: 0.18 }, "s3")
      .to(q(".dh-xrack"), { autoAlpha: 1, duration: 0.01 }, "s3")
      .to(q(".dh-xrack"), { x: geo.out.x, y: geo.out.y, duration: 0.9 }, "s3+=0.05")
      .to(lbl("rack"), { autoAlpha: 1, duration: 0.4 }, "s3+=0.8");
    mods.forEach(function (mEl, i) {
      tl.to(mEl, { y: -i * SPREAD * S, duration: 0.7, ease: "power3.inOut" }, "s3+=1.1");
    });
    tl.to(lbl("mods"), { autoAlpha: 1, duration: 0.4 }, "s3+=1.7")
      .fromTo(q(".dh-cell"), { autoAlpha: 0, x: 0, y: 0 }, { autoAlpha: 1, y: -LIFT * S, x: function (i) { return (i - 3.5) * 11; }, duration: 0.6, stagger: 0.04, ease: "power3.out" }, "s3+=2")
      .to(lbl("cells"), { autoAlpha: 1, duration: 0.4 }, "s3+=2.5")
      .to({}, { duration: 0.4 }, "s3+=2.9");

    // 4. The rack goes back in; safety and controls: BMS, HVAC, fire suppression, PCS
    tl.addLabel("s4", 9.9)
      .to(lbl("rack").concat(lbl("mods"), lbl("cells")), { autoAlpha: 0, duration: 0.3 }, "s4")
      .to(q(".dh-cell"), { x: 0, y: 0, autoAlpha: 0, duration: 0.45, stagger: 0.02 }, "s4+=0.05");
    mods.forEach(function (mEl) { tl.to(mEl, { y: 0, duration: 0.45 }, "s4+=0.35"); });
    tl.to(q(".dh-xrack"), { x: 0, y: 0, duration: 0.7 }, "s4+=0.75")
      .set(q(".dh-rack-x"), { opacity: 1 }, "s4+=1.45")
      .set(q(".dh-xrack"), { autoAlpha: 0 }, "s4+=1.45")
      .to(lbl("bms"), { autoAlpha: 1, duration: 0.4 }, "s4+=1.5")
      .to(lbl("hvac"), { autoAlpha: 1, duration: 0.4 }, "s4+=1.7")
      .to(lbl("fire"), { autoAlpha: 1, duration: 0.4 }, "s4+=1.9")
      .to(lbl("pcs"), { autoAlpha: 1, duration: 0.4 }, "s4+=2.1")
      .fromTo(q(".dh-bms .dh-screen, .dh-fire, .dh-hvac, .dh-pcs .dh-bolt"), { filter: "none" }, { filter: "drop-shadow(0 0 6px rgba(255,177,0,.9))", duration: 0.4, yoyo: true, repeat: 1 }, "s4+=1.6")
      .to({}, { duration: 0.4 }, "s4+=2.5");

    // 5. Test charge, the shell closes, the Dholera stamp
    tl.addLabel("s5", 12.9)
      .to(q(".dh-lbl"), { autoAlpha: 0, duration: 0.3 }, "s5")
      .fromTo(q(".dh-rack .dh-led"), { fill: "#607a5f" }, { fill: "#ffb100", duration: 0.25, stagger: 0.012 }, "s5+=0.2")
      .to(q(".dh-wall"), { x: 0, y: 0, opacity: 1, duration: 0.7 }, "s5+=1")
      .to(q(".dh-roof"), { y: 0, duration: 0.6, ease: "power3.in" }, "s5+=1.3")
      .fromTo(q(".dh-stamp"), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, "s5+=1.9")
      .to({}, { duration: 0.8 }, "s5+=2.5")
      .addLabel("end");
    return tl;
  }

  $$("svg[data-dholera]").forEach(function (svg) {
    var mode = svg.getAttribute("data-dholera");
    var geo = buildScene(svg);
    if (!hasGsap) { svg.classList.add("dh-static"); return; }
    var tl = sceneTimeline(svg, geo);
    var STEPS = ["s1", "s2", "s3", "s4", "s5", "end"];
    var at = function (k) { return tl.labels[k] !== undefined ? tl.labels[k] : tl.duration(); };
    // The settled frame for each step (just before the next step starts)
    var frame = [at("s2") - 0.05, at("s3") - 0.05, at("s4") - 0.05, at("s5") - 0.05, tl.duration()];

    if (reduced) {
      // No scrubbing: show each step's settled frame
      tl.progress(1).time(mode === "loop" ? frame[2] : frame[0]);
      if (mode === "scroll") {
        var story = svg.closest("[data-story]");
        var steps = story ? $$(".story-step", story) : [];
        if ("IntersectionObserver" in window) {
          var rio = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) tl.time(frame[steps.indexOf(e.target)] || frame[0]); });
          }, { rootMargin: "-45% 0px -45% 0px" });
          steps.forEach(function (s) { rio.observe(s); });
        }
      }
      return;
    }

    if (mode === "loop") {
      var q = gsap.utils.selector(svg);
      tl.to(q(".dh-ctr, .dh-pcs, .dh-site, .dh-stamp"), { autoAlpha: 0, duration: 0.6 }, "end+=1.4");
      tl.repeat(-1).repeatDelay(0.2);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) tl.play(); else tl.pause(); });
        }, { threshold: 0.25 }).observe(svg);
      } else tl.play();
      return;
    }

    // Scroll mode: each story step scrubs through its own act
    var storyEl = svg.closest("[data-story]");
    var stepEls = storyEl ? $$(".story-step", storyEl) : [];
    if (!stepEls.length) { tl.play(); return; }
    var starts = [0, at("s2"), at("s3"), at("s4"), at("s5")];
    var ends = [frame[0], frame[1], frame[2], frame[3], frame[4]];
    var target = 0, ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.55;
      var t = 0;
      for (var i = 0; i < stepEls.length; i++) {
        var r = stepEls[i].getBoundingClientRect();
        if (line < r.top) break;
        var f = clamp((line - r.top) / Math.max(1, r.height * 0.7), 0, 1);
        t = starts[i] + f * (ends[i] - starts[i]);
      }
      if (Math.abs(t - target) < 0.001) return;
      target = t;
      gsap.to(tl, { time: t, duration: 0.6, ease: "power2.out", overwrite: true });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  });

  /* ------------------------------------------------------------------
     Hero: sunset -> night -> launch card
     ------------------------------------------------------------------ */
  (function heroNight() {
    var hero = $(".hero");
    var card = $("#launch-pop");
    var scene = $("#hero-scene");
    if (!hero || !card || !scene) return;
    var stars = $(".hero-stars", hero);
    if (stars && !stars.childElementCount) {
      var s = "";
      for (var i = 0; i < 70; i++) {
        s += '<i style="left:' + (Math.random() * 100).toFixed(2) + "%;top:" + (Math.random() * 62).toFixed(2) + "%;--o:" + (0.35 + Math.random() * 0.65).toFixed(2) +
          ";--d:" + (-Math.random() * 4).toFixed(2) + "s;--z:" + (Math.random() < 0.15 ? 3 : 2) + 'px"></i>';
      }
      stars.innerHTML = s;
    }
    var openBtns = $$("[data-launch-open]");
    var closeBtns = $$("[data-launch-close]", card);
    var night = false, busy = null;
    var mobile = window.matchMedia("(max-width: 700px)");

    function sunEl() { return $(".hz-sun", scene); }
    function placeCard() {
      card.style.left = card.style.top = "";
      card.classList.remove("is-compact");
      if (mobile.matches) return;
      var hr = hero.getBoundingClientRect();
      var ab0 = ($(".hero-announce", hero) || hero).getBoundingClientRect().bottom - hr.top;
      // Short viewports: drop the body copy so the card clears the hero buttons
      if (hr.height - card.offsetHeight - 16 < ab0 + 20) card.classList.add("is-compact");
      var sun = sunEl();
      var sr = sun ? sun.getBoundingClientRect() : { left: hr.width * 0.7, top: hr.height * 0.7, width: 0, height: 0 };
      var actions = $(".hero-announce", hero) || $(".hero-actions", hero);
      var ab = actions ? actions.getBoundingClientRect().bottom - hr.top : hr.height * 0.5;
      var cw = card.offsetWidth, ch = card.offsetHeight;
      var gutter = Math.max(16, (hr.width - 1280) / 2);
      var sx = sr.left - hr.left + sr.width / 2;
      var left = clamp(sx - cw * 0.3, gutter, hr.width - gutter - cw);
      var top = clamp(hr.height - ch - Math.max(28, hr.height * 0.06), ab + 20, hr.height - ch - 16);
      card.style.left = left + "px";
      card.style.top = top + "px";
      card.style.transformOrigin = (sx - left) + "px " + (sr.top - hr.top + sr.height / 2 - top) + "px";
    }

    function showCard(animate) {
      card.hidden = false;
      placeCard();
      if (animate && hasGsap) {
        gsap.fromTo(card, { opacity: 0, scale: 0.15 }, { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.4)" });
        gsap.fromTo($$(".lp-in > *", card), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.35, ease: "power2.out" });
      } else { card.style.opacity = 1; card.style.transform = "none"; }
    }
    function hideCard() {
      if (hasGsap && !reduced) gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.35, ease: "power2.in", onComplete: function () { card.hidden = true; } });
      else card.hidden = true;
    }

    function toNight(animate) {
      if (night) return;
      night = true;
      clearTimeout(busy);
      openBtns.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
      if (!animate || !hasGsap) {
        hero.classList.add("is-night", "no-fade");
        if (hasGsap) gsap.set(sunEl(), { y: 260 });
        showCard(false);
        requestAnimationFrame(function () { hero.classList.remove("no-fade"); });
        return;
      }
      hero.classList.add("is-dusk");
      gsap.to(sunEl(), { y: 260, duration: 2.6, ease: "power1.in" });
      gsap.to($(".hz-sun-core", scene), { attr: { fill: "#ff8f3a" }, duration: 2 });
      busy = setTimeout(function () {
        hero.classList.add("is-night");
        busy = setTimeout(function () {
          hero.classList.remove("is-dusk");
          showCard(true);
        }, 1500);
      }, 1100);
    }
    function toDay() {
      if (!night) return;
      night = false;
      clearTimeout(busy);
      hideCard();
      openBtns.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      hero.classList.remove("is-night", "is-dusk");
      if (hasGsap) {
        gsap.to(sunEl(), { y: 0, duration: reduced ? 0 : 1.8, ease: "power2.out", delay: reduced ? 0 : 0.3 });
        gsap.to($(".hz-sun-core", scene), { attr: { fill: "#ffd45e" }, duration: reduced ? 0 : 1.4, delay: 0.3 });
      }
    }

    closeBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        toDay();
        var first = openBtns[0];
        if (first) first.focus({ preventScroll: true });
      });
    });
    openBtns.forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        if (night) toDay(); else toNight(!reduced);
      });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && night) toDay(); });
    window.addEventListener("resize", function () { if (!card.hidden) placeCard(); });

    // Play once per session, a few seconds after the landscape has built
    var seen = false;
    try { seen = sessionStorage.getItem("stg-sunset") === "1"; } catch (e) {}
    if (seen || reduced || !hasGsap) return;
    var timer = null, armed = true;
    function arm() {
      if (!armed) return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!armed || window.scrollY > window.innerHeight * 0.35 || document.hidden) return;
        armed = false;
        try { sessionStorage.setItem("stg-sunset", "1"); } catch (e) {}
        toNight(true);
      }, 4200);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) arm(); else clearTimeout(timer); });
      }, { threshold: 0.65 }).observe(hero);
    } else arm();
    // Someone who is already interacting gets a short pause before the sunset
    ["pointerdown", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, function () { if (armed && timer) arm(); }, { passive: true });
    });
  })();
})();
