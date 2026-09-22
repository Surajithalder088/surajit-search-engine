import { useState } from "react";
import { generateAIAnswer } from "./ai-service";
import ReactMarkdown from "react-markdown";

function App() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("home");


  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [aiSearch, setAiSearch] = useState("")
  const [aiLoading, setaiLoading] = useState(false)
  const [aiExpanded, setAiExpanded] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoMuted, setVideoMuted] = useState(true);

  const cleanUrl = (value = "") => {
    const match = value.match(/\((https?:\/\/[^)]+)\)/);

    if (match) return match[1];

    return value.replace(/^\[|\]$/g, "");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;
    setMode('search')

    setLoading(true);
    setError("");
    setSearchResults(null);

    try {
      const response = await fetch(
        `https://search-engine-api-psi.vercel.app/api/search?q=${encodeURIComponent(
          query.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Search failed");
      }
      console.log(data);

      if (data.status === 200) {
        setSearchResults(data);
      }

    } catch (error) {
      console.error("Search error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      try {
        setaiLoading(true)
        const aires = await generateAIAnswer(query)
        console.log(aires);

        setAiSearch(aires)
        setaiLoading(false)
      } catch (error) {
        console.log(error);
        setaiLoading(false)
      }
    }
  };



  const scrollImages = (direction) => {
    const container = document.getElementById("image-results");

    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 text-black">

      {/* HOME */}
      {mode === "home" && (
        <section className="min-h-screen flex flex-col items-center justify-center px-5">

          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
              Surajit's Search
            </h1>

            <p className="mt-4 text-gray-600 text-base md:text-lg">
              An India-based Indian search page to find whatever you want to search.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl"
          >
            <div className="search-border-box">

              <div className="search-border-glow" />

              <div className="search-input-inner">

                <div className="absolute left-5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full h-14 pl-14 pr-6 rounded-full bg-white/90 outline-none text-base md:text-lg placeholder:text-gray-400 focus:ring-4 focus:ring-green-100 transition"
                />

              </div>

            </div>
          </form>
          <p className="mt-5 text-sm text-gray-500">
            Press Enter to search
          </p>

          <div className="mt-8 max-w-2xl text-center">
            <h2 className="text-lg font-medium text-gray-800">
              About this search engine
            </h2>

            <p className="mt-2 text-sm md:text-base leading-6 text-gray-500">
              Surajit’s Search is an India-based search engine designed to help you
              discover information, images, and videos from across the web in one
              simple place. Search anything you need and explore relevant results
              through a clean, fast, and easy-to-use experience.
            </p>
          </div>

        </section>
      )}

      {/* SEARCH */}
      {mode === "search" && (
        <section className="min-h-screen px-4 sm:px-5 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto">

            <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
              Surajit's Search
            </h1>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center bg-white border border-green-200 rounded-full overflow-hidden focus-within:border-green-400 transition">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="flex-1 h-12 px-5 outline-none bg-transparent text-black"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-6 bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-50"
                >
                  {loading ? "..." : ""}
                </button>
              </div>
            </form>

            {/* Tabs */}
            {searchResults && (
              <div className="flex gap-6 border-b border-green-100 mb-6">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`pb-3 text-sm font-medium cursor-pointer ${activeTab === "all"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-500"
                    }`}
                >
                  All
                </button>

                <button
                  onClick={() => setActiveTab("images")}
                  className={`pb-3 text-sm font-medium cursor-pointer ${activeTab === "images"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-500"
                    }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`pb-3 text-sm font-medium cursor-pointer ${activeTab === "videos"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-500"
                    }`}
                >
                  Videos
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="py-16 flex flex-col items-center justify-center">

                {/* Magnifying Glass Animation */}
                <div className="relative w-24 h-24 mb-5">

                  {/* Search circle */}
                  <div
                    className="
        absolute
        left-2
        top-2
        w-16
        h-16
        rounded-full
        border-[6px]
        border-green-400
        animate-pulse
      "
                  />

                  {/* Glass shine */}
                  <div
                    className="
        absolute
        left-[19px]
        top-[16px]
        w-5
        h-2
        rounded-full
        bg-green-200
        rotate-[-35deg]
        opacity-80
      "
                  />

                  {/* Handle */}
                  <div
                    className="
        absolute
        left-[58px]
        top-[60px]
        w-10
        h-[6px]
        rounded-full
        bg-green-500
        rotate-45
        origin-left
      "
                  />

                  {/* Moving scanning dot */}
                  <div
                    className="
        absolute
        left-[27px]
        top-[27px]
        w-3
        h-3
        rounded-full
        bg-green-500
        animate-ping
      "
                  />
                </div>

                {/* Searching Text */}
                <div className="flex items-center gap-1 text-lg font-medium text-gray-700">
                  <span>Searching</span>

                  <span className="flex gap-1 ml-1">
                    <span className="animate-bounce [animation-delay:0ms]">.</span>
                    <span className="animate-bounce [animation-delay:150ms]">.</span>
                    <span className="animate-bounce [animation-delay:300ms]">.</span>
                  </span>
                </div>

                {/* Loader */}
                <div className="mt-4 w-8 h-8 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />

                <p className="mt-3 text-xs text-gray-400">
                  Finding the best results for you
                </p>

              </div>
            )}

            {/* Error */}
            {error && (
              <div className="py-16 flex flex-col items-center justify-center text-center">

                {/* Failed Search Illustration */}
                <div className="relative w-28 h-28 mb-6">

                  {/* Search circle */}
                  <div className="absolute left-2 top-2 w-20 h-20 rounded-full border-[6px] border-gray-300" />

                  {/* Broken line */}
                  <div className="absolute left-[29px] top-[40px] w-14 h-[5px] bg-gray-400 rotate-45 rounded-full" />

                  {/* Handle */}
                  <div className="absolute left-[70px] top-[76px] w-12 h-[6px] bg-gray-400 rotate-45 rounded-full origin-left" />

                  {/* X */}
                  <div className="absolute left-[31px] top-[27px] w-8 h-8">
                    <span className="absolute left-3 top-0 w-[4px] h-8 bg-red-400 rounded-full rotate-45" />
                    <span className="absolute left-3 top-0 w-[4px] h-8 bg-red-400 rounded-full -rotate-45" />
                  </div>

                </div>

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Search failed
                </h2>

                {/* Message */}
                <p className="mt-2 max-w-md text-sm sm:text-base text-gray-500 leading-6">
                  We couldn't get a response from the search engine.
                  Please check your connection and try again.
                </p>

                {/* Actual error - optional */}
                {error && (
                  <p className="mt-2 text-xs text-gray-400 max-w-md">
                    {error}
                  </p>
                )}

                {/* Retry */}
                <button
                  onClick={handleSearch}
                  className="mt-6 px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                >
                  Try again
                </button>

              </div>
            )}

            {/* Results */}
            {searchResults && !loading && (
              <>
                {/* ALL TAB */}
                {activeTab === "all" && (
                  <div>

                    {/* Images horizontal row */}
                    {/* Images + Videos Results */}

                    {(
                      searchResults.images?.data?.length > 0

                    ) && (
                        <div className="mb-8">

                          <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold">
                              Images & Videos
                            </h2>

                            <button
                              onClick={() => setActiveTab("images")}
                              className="text-sm text-green-600 hover:underline"
                            >
                              See all
                            </button>
                          </div>

                          <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth">

                            {/* ================================= */}
                            {/* FIRST IMAGE - INDEX 0 */}
                            {/* ================================= */}

                            {searchResults.images?.data?.[0] && (
                              <button

                                type="button"
                                onClick={() => setSelectedImage(searchResults.images?.data?.[0])}
                                className="group text-left w-full flex-shrink-0 w-40 sm:w-48"
                              >
                                <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-gray-100 border border-green-100">
                                  <img
                                    src={
                                      searchResults.images.data[0].thumbnail ||
                                      searchResults.images.data[0].image
                                    }
                                    alt={
                                      searchResults.images.data[0].title ||
                                      "Search image"
                                    }
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>

                                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                  {searchResults.images.data[0].title}
                                </p>
                              </button>
                            )}

                            {/* ================================= */}
                            {/* FIRST 3 VIDEOS */}
                            {/* ================================= */}


                            {searchResults.videos?.data?.length > 0 &&
                              searchResults.videos.data.slice(0, 3).map((item, index) => {
                                let videoId = "";

                                try {
                                  videoId = new URL(item.url).searchParams.get("v") || "";
                                } catch { }

                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setSelectedVideo(item);
                                      setVideoMuted(true);
                                    }}
                                    className="group text-left w-full flex-shrink-0 w-40 sm:w-48"
                                  >

                                    <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden bg-gray-900 border border-green-100">

                                      {videoId ? (
                                        <iframe
                                          className="w-full h-full pointer-events-none"
                                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0`}
                                          title={item.title || "YouTube video"}
                                          frameBorder="0"
                                          allow="autoplay; encrypted-media"
                                          allowFullScreen
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                                          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                            <span className="text-white text-lg ml-1">
                                              ▶
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Video label */}
                                      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/70">
                                        <span className="text-[10px] text-white font-medium">
                                          VIDEO
                                        </span>
                                      </div>

                                    </div>

                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                      {item.title || "Video result"}
                                    </p>
                                  </button>
                                );
                              })}



                            {/* ================================= */}
                            {/* REST OF IMAGES - SKIP INDEX 0 */}
                            {/* ================================= */}

                            {searchResults.images?.data
                              ?.slice(1)
                              .map((item, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setSelectedImage(item)}
                                  className="group text-left w-full flex-shrink-0 w-40 sm:w-48"
                                >
                                  <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-gray-100 border border-green-100">
                                    <img
                                      src={item.thumbnail || item.image}
                                      alt={item.title || "Search image"}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>

                                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                    {item.title}
                                  </p>
                                </button>
                              ))}

                          </div>
                        </div>
                      )}

                    {/* //ai search result */}
                    <div className="mb-8 rounded-2xl bg-gray-100 border border-gray-200 p-5 sm:p-6">

                      {/* AI Header */}
                      <div className="flex items-center justify-between mb-5">

                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              AI
                            </span>
                          </div>

                          <span className="text-sm font-medium text-gray-700">
                            AI Overview
                          </span>

                        </div>

                        {/* AI Logo */}
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-black">
                            AI
                          </span>
                        </div>

                      </div>

                      {/* AI Response / Skeleton */}
                      {aiLoading ? (
                        <div className="space-y-3">

                          <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse" />

                          <div className="h-4 w-[94%] bg-gray-300 rounded-md animate-pulse" />

                          <div className="h-4 w-[88%] bg-gray-300 rounded-md animate-pulse" />

                          <div className="h-4 w-[65%] bg-gray-300 rounded-md animate-pulse" />

                        </div>
                      ) : (
                        <div className="text-black text-[15px] sm:text-base leading-7">

                          <div className="relative">

                            {/* AI Response */}
                            <div
                              className={`
      text-black text-[15px] sm:text-base leading-7
      overflow-hidden transition-all duration-300
      ${aiExpanded ? "max-h-none" : "max-h-[70px] sm:max-h-[105px]"}
    `}
                            >
                              <ReactMarkdown
                                components={{
                                  strong: ({ children }) => (
                                    <strong className="font-semibold text-black">
                                      {children}
                                    </strong>
                                  ),

                                  p: ({ children }) => (
                                    <p className="mb-4 leading-7">
                                      {children}
                                    </p>
                                  ),

                                  ul: ({ children }) => (
                                    <ul className="list-disc pl-5 space-y-2 mb-4">
                                      {children}
                                    </ul>
                                  ),

                                  li: ({ children }) => (
                                    <li className="pl-1 leading-7">
                                      {children}
                                    </li>
                                  ),
                                }}
                              >
                                {aiSearch}
                              </ReactMarkdown>
                            </div>

                            {/* See More */}
                            {!aiExpanded && (
                              <div className="relative -mt-7 pt-7 bg-gradient-to-t from-gray-100 via-gray-100/95 to-transparent">
                                <button
                                  type="button"
                                  onClick={() => setAiExpanded(true)}
                                  className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
                                >
                                  See more
                                </button>
                              </div>
                            )}

                            {/* See Less */}
                            {aiExpanded && (
                              <div className="mt-3">
                                <button
                                  type="button"
                                  onClick={() => setAiExpanded(false)}
                                  className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
                                >
                                  See less
                                </button>
                              </div>
                            )}

                          </div>


                        </div>
                      )}

                    </div>

                    {/* Website results */}
                    <div className="space-y-7">

                      {searchResults.text?.data?.results?.map((result, index) => {
                        const url = cleanUrl(result.url);

                        return (
                          <article key={index}>

                            <a
                              href={url}
                              target="_self"
                              className="text-xs text-green-700 break-all hover:underline"
                            >
                              {url}
                            </a>

                            <a
                              href={url}
                              target="_self"
                              className="block text-xl text-blue-700 hover:underline mt-1"
                            >
                              {result.title}
                            </a>

                            <p
                              className="text-sm text-gray-600 mt-1 leading-6"
                              dangerouslySetInnerHTML={{
                                __html: result.description || "",
                              }}
                            />

                          </article>
                        );
                      })}

                    </div>
                  </div>
                )}

                {/* IMAGES TAB */}
                {activeTab === "images" && (
                  <div>

                    <h2 className="text-xl font-semibold mb-5">
                      Images for "{searchResults.query}"
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                      {searchResults.images?.data?.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(item)}
                          className="group text-left w-full flex-shrink-0 w-40 sm:w-48"
                        >
                          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-green-100">
                            <img
                              src={item.thumbnail || item.image}
                              alt={item.title || "Search image"}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                          </div>

                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {item.title}
                          </p>
                        </button>
                      ))}

                    </div>

                  </div>
                )}

                {/* VIDEOS TAB */}

                {activeTab === "videos" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-5">
                      Videos for "{searchResults.query}"
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {searchResults.videos?.data?.map((item, index) => {
                        let videoId = "";

                        try {
                          videoId = new URL(item.url).searchParams.get("v") || "";
                        } catch { }

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedVideo(item);
                              setVideoMuted(true);
                            }}
                            className="group text-left w-full flex-shrink-0 w-40 sm:w-48"
                          >
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-green-100">
                              {videoId ? (
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0`}
                                  title={item.title || "Search video"}
                                  className="w-full h-full pointer-events-none"
                                  frameBorder="0"
                                  allow="autoplay; encrypted-media"
                                  allowFullScreen
                                />
                              ) : (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title || "Search video"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  loading="lazy"
                                />
                              )}
                            </div>

                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                              {item.title || "Video result"}
                            </p>

                            {item.publishedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.publishedAt}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}


              </>
            )}

          </div>
        </section>
      )}

      {/* IMAGE VIEWER MODAL */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-[95vw] max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center text-lg hover:bg-black transition"
            >
              ×
            </button>

            {/* Image */}
            <a
              href={selectedImage.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={selectedImage.image || selectedImage.thumbnail}
                alt={selectedImage.title || "Search image"}
                className="max-w-[95vw] max-h-[92vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
              /></a>

            {/* Image Title */}
            {selectedImage.title && (
              <p className="text-white text-sm mt-3 text-center max-w-3xl mx-auto">
                {selectedImage.title}
              </p>
            )}
          </div>
        </div>
      )}


      {/* VIDEO VIEWER MODAL */}

      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center text-lg hover:bg-black transition"
            >
              ×
            </button>

            {/* Video */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
              {(() => {
                let videoId = "";

                try {
                  videoId =
                    new URL(selectedVideo.url).searchParams.get("v") || "";
                } catch { }

                return videoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${videoMuted ? 1 : 0}&controls=1&rel=0`}
                    title={selectedVideo.title || "YouTube video"}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : null;
              })()}
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-white text-sm line-clamp-2 pr-4">
                {selectedVideo.title || "Video result"}
              </p>

              <button
                type="button"
                onClick={() => setVideoMuted((prev) => !prev)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
              >
                {videoMuted ? "🔇 Unmute" : "🔊 Mute"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default App;