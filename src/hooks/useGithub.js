import { useEffect, useRef, useState } from 'react';
import { fetchProfile, fetchRepositories } from '../services/github.js';

export default function useGithub(username) {
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');
  const [revision, setRevision] = useState(0);
  const moreController = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    moreController.current?.abort();
    setStatus('loading');
    setError('');
    setMoreError('');
    setLoadingMore(false);
    setProfile(null);
    setRepositories([]);
    setNextPage(null);

    Promise.all([
      fetchProfile(username, { signal: controller.signal }),
      fetchRepositories(username, { signal: controller.signal }),
    ]).then(([newProfile, result]) => {
      if (controller.signal.aborted) return;
      setProfile(newProfile);
      setRepositories(result.repositories);
      setNextPage(result.nextPage);
      setStatus('success');
    }).catch(failure => {
      if (controller.signal.aborted) return;
      setError(failure.message);
      setStatus('error');
      controller.abort();
    });

    return () => {
      controller.abort();
      moreController.current?.abort();
    };
  }, [username, revision]);

  async function loadMore() {
    if (!nextPage || loadingMore || moreController.current && !moreController.current.signal.aborted) return;
    const controller = new AbortController();
    moreController.current = controller;
    setLoadingMore(true);
    setMoreError('');
    try {
      const result = await fetchRepositories(username, { page: nextPage, signal: controller.signal });
      if (controller.signal.aborted) return;
      setRepositories(previous => {
        const merged = new Map(previous.map(repo => [repo.id, repo]));
        result.repositories.forEach(repo => merged.set(repo.id, repo));
        return [...merged.values()];
      });
      setNextPage(result.nextPage);
    } catch (failure) {
      if (!controller.signal.aborted) setMoreError(failure.message);
    } finally {
      if (!controller.signal.aborted) setLoadingMore(false);
      if (moreController.current === controller) moreController.current = null;
    }
  }

  return { profile, repositories, status, error, nextPage, loadingMore, moreError, loadMore, refresh: () => setRevision(value => value + 1) };
}
