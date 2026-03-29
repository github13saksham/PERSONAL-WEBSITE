const fetchProjects = async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME || 'github13saksham';
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('GitHub fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
};

module.exports = { fetchProjects };
