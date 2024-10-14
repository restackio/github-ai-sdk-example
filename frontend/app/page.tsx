"use client";

import React, { useState } from "react";
import { createRelease } from "./utils/createRelease";
import { Releases } from "./releases";
import { getReleases } from "./utils/getReleases";

export default function Home() {
  const [gitUrl, setGitUrl] = useState("");
  const [releases, setReleases] = useState([]);

  const getGithubReleases = async () => {
    const releases = await getReleases(gitUrl);
    setReleases(releases);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tagName = formData.get("tagName") as string;
    const releaseName = formData.get("releaseName") as string;
    const releaseBody = formData.get("releaseBody") as string;
    const repoUrl = formData.get("repoUrl") as string;

    await createRelease({
      tagName,
      releaseName,
      releaseBody,
      repoUrl,
    });

    await getGithubReleases();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold mb-4">Create Release</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="GitHub Repository URL"
            className="border rounded p-2"
            required
            onChange={(e) => setGitUrl(e.target.value)}
            name="repoUrl"
          />
          <input
            type="text"
            placeholder="Release name"
            className="border rounded p-2"
            required
            name="releaseName"
          />
          <input
            type="text"
            placeholder="v1.0.0"
            className="border rounded p-2"
            required
            name="tagName"
          />
          <textarea
            placeholder="Description"
            className="border rounded p-2"
            required
            name="releaseBody"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2"
            disabled={!gitUrl}
          >
            Create Release
          </button>
          <button
            type="button"
            className="bg-green-500 text-white rounded p-2 mt-2"
            disabled={!gitUrl}
            onClick={() => getGithubReleases()}
          >
            Get Releases
          </button>
        </form>
        <Releases releases={releases} gitUrl={gitUrl} />
      </main>
    </div>
  );
}
