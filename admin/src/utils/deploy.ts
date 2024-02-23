async function getDeploy(
  token: string,
  team: string,
  projectId: string,
  branch: string,
  filter: string,
  time: number
) {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const deploysJson = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${team}&meta-deployHookRef=${branch}&limit=1&${filter}=${time}`,
    {
      method: "get",
      mode: "cors",
      headers,
    }
  ).then((res) => res.json());

  const deploy = deploysJson.deployments;

  if (deploy.length > 0) {
    return deploy[0].state;
  }
}

async function triggerAndTrackDeploy(
  deploymentUrl: string,
  token: string,
  team: string,
  branch: string,
  projectId: string
) {
  const jobJson = await fetch(deploymentUrl, {
    method: "post",
    mode: "cors",
  }).then((res) => res.json());

  const job = jobJson.job;
  const jobTime = job.createdAt;

  setInterval(() => {
    getDeploy(token, team, projectId, branch, "since", jobTime);
  }, 10000);
}

export { triggerAndTrackDeploy, getDeploy };
