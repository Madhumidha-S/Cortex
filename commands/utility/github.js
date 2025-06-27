const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { generateCompletion } = require("../../services/togetherAIService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github-insight")
    .setDescription("Get a summarized insight of a GitHub user")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("GitHub username")
        .setRequired(true)
    ),

  async execute(interaction) {
    const username = interaction.options.getString("username");
    await interaction.deferReply();

    try {
      const { data: user } = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const { data: repos } = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );
      const totalStars = repos.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
      );
      const topRepo = repos.reduce(
        (max, repo) =>
          repo.stargazers_count > (max?.stargazers_count || 0) ? repo : max,
        null
      );
      const languages = {};
      repos.forEach((repo) => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      const langStats = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(([lang, count]) => `${lang} (${count})`)
        .join(", ");

      const prompt = `Analyze this GitHub profile:
      Username: ${username}
      Public Repos: ${user.public_repos}
      Followers: ${user.followers}
      Stars: ${totalStars}
      Languages: ${langStats}
      Top Repo: ${topRepo?.name || "N/A"} (${
        topRepo?.stargazers_count || 0
      } stars)
      Give a professional summary of the developer.`;

      const aiSummary = await generateCompletion(prompt);

      const reply = `**@${username}**
      ${user.public_repos} Repositories | ${totalStars} Stars | ${
        user.followers
      } Followers
      **Top Languages:** ${langStats || "No data"}
      **Most Starred Repo:** ${topRepo?.name || "N/A"} (${
        topRepo?.stargazers_count || 0
      })
      **AI Insight:** ${aiSummary}`;

      await interaction.editReply(reply);
    } catch (err) {
      console.error(err);
      await interaction.editReply(
        "Failed to fetch GitHub data. Make sure the username is valid."
      );
    }
  },
};
