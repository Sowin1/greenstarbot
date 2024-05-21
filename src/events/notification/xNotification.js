console.log(`Testing`);
const fs = require('fs');
const { TwitterApi } = require('twitter-api-v2');
const { MessageEmbed } = require('discord.js');
require("dotenv/config");


const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const channelId = process.env.XCHANNEL;
console.log(twitterClient);
const postedTweetsFile = './postedTweets.json';

module.exports = async ( message, client, handler) => {

    console.log("module.exports");

    // Function to load posted tweet IDs from a file
    const loadPostedTweets = () => {
        if (fs.existsSync(postedTweetsFile)) {
            const data = fs.readFileSync(postedTweetsFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    };
    console.log('Loading posted');
    // Function to save posted tweet IDs to a file
    const savePostedTweets = (tweets) => {
        fs.writeFileSync(postedTweetsFile, JSON.stringify(tweets), 'utf8');
    };

    // Function to check for new tweets and post to Discord
    const checkAndPostTweet = async () => {
        try {
            const postedTweets = loadPostedTweets();

            const tweets = await twitterClient.v2.userByUsername(process.env.TWITTER_USERNAME).tweets();

            for (const tweet of tweets.data) {
                if (!postedTweets.includes(tweet.id)) {
                    const embed = new MessageEmbed()
                        .setTitle('Nouveau tweet')
                        .setDescription(tweet.text)
                        .setColor('#1DA1F2')
                        .setURL(`https://twitter.com/${process.env.TWITTER_USERNAME}/status/${tweet.id}`);

                    const channel = client.channels.cache.get(channelId);
                    console.log('Create embed');
                    if (channel) {
                        await channel.send({ embeds: [embed] });
                        postedTweets.push(tweet.id);
                    }
                }
            }

            savePostedTweets(postedTweets);
        } catch (error) {
            console.error('Error fetching and posting tweet:', error);
        }
    };
    console.log('End of functions');
    setInterval(checkAndPostTweet, process.env.TWEET_POST_INTERVAL);
};
