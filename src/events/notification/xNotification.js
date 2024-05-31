console.log(`Testing`);
const fs = require("fs");
const { TwitterApi } = require("twitter-api-v2");
const { MessageEmbed } = require("discord.js");
require("dotenv").config();

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const channelId = process.env.XCHANNEL;
console.log(twitterClient);
const postedTweetsFile = "./postedTweets.json";

// Function to load posted tweet IDs from a file
const loadPostedTweets = () => {
  if (fs.existsSync(postedTweetsFile)) {
    const data = fs.readFileSync(postedTweetsFile, "utf8");
    return JSON.parse(data);
  }
  return [];
};

// Function to save posted tweet IDs to a file
const savePostedTweets = (tweets) => {
  fs.writeFileSync(postedTweetsFile, JSON.stringify(tweets), "utf8");
};

// Function to check for new tweets and post to Discord
const checkAndPostTweet = async (client) => {
  try {
    const postedTweets = loadPostedTweets();
    const user = await twitterClient.v2.userByUsername(
      process.env.TWITTER_USERNAME
    );
    const tweets = await twitterClient.v2.userTimeline(user.data.id);

    for (const tweet of tweets.data) {
      if (!postedTweets.includes(tweet.id)) {
        const embed = new MessageEmbed()
          .setTitle("Nouveau tweet")
          .setDescription(tweet.text)
          .setColor("#1DA1F2")
          .setURL(
            `https://twitter.com/${process.env.TWITTER_USERNAME}/status/${tweet.id}`
          );

        const channel = client.channels.cache.get(channelId);
        console.log("Create embed");
        if (channel) {
          await channel.send({ embeds: [embed] });
          postedTweets.push(tweet.id);
        }
      }
    }
    savePostedTweets(postedTweets);
  } catch (error) {
    console.error("Error fetching and posting tweet:", error);
  }
};

module.exports = (client) => {
  setInterval(() => checkAndPostTweet(client), process.env.TWEET_POST_INTERVAL);
};
