const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// Vos clés et tokens
const client = new TwitterApi({
  appKey: 'votre_api_key',
  appSecret: 'votre_api_secret_key',
  accessToken: 'votre_access_token',
  accessSecret: 'votre_access_token_secret',
});

const postedTweetsFile = path.join(__dirname, 'postedTweets.json');
let postedTweets = [];

// Vérifiez et chargez les tweets déjà enregistrés
if (fs.existsSync(postedTweetsFile)) {
  try {
    const data = fs.readFileSync(postedTweetsFile, 'utf8');
    postedTweets = JSON.parse(data || '[]'); // Assurez-vous que postedTweets est un tableau
  } catch (err) {
    console.error('Erreur lors de la lecture du fichier JSON:', err);
    postedTweets = [];
  }
} else {
  // Initialiser le fichier JSON si n'existe pas
  fs.writeFileSync(postedTweetsFile, JSON.stringify([]));
}

// Fonction pour vérifier les tweets
async function checkForNewTweets() {
  try {
    const username = 'EsportGreenStar';
    const user = await client.v2.userByUsername(username);
    const userId = user.data.id;

    const tweets = await client.v2.userTimeline(userId, { exclude: 'retweets,replies', max_results: 5 });

    for (const tweet of tweets.data) {
      const tweetId = tweet.id;
      if (!postedTweets.includes(tweetId)) {
        // Nouveau tweet trouvé
        const text = tweet.text;
        const images = tweet.attachments?.media_keys || [];
        const tweetUrl = `https://twitter.com/${username}/status/${tweetId}`;
        const date = new Date(tweet.created_at).toLocaleString();

        console.log('Nouveau tweet trouvé:');
        console.log('Texte:', text);
        console.log('Images:', images);
        console.log('Lien du tweet:', tweetUrl);
        console.log('Date et heure:', date);

        // Enregistrer le tweet dans le fichier JSON
        postedTweets.push(tweetId);
        fs.writeFileSync(postedTweetsFile, JSON.stringify(postedTweets, null, 2));
      }
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des tweets:', err);
  }
}

// Vérifiez l'authentification
async function checkAuthentication() {
  try {
    const user = await client.currentUser();
    console.log('Authentification réussie en tant que', user.username);
  } catch (err) {
    console.error('Erreur lors de l\'authentification:', err);
    process.exit(1); // Arrêter le script si l'authentification échoue
  }
}

// Vérifier les tweets toutes les 60 secondes
setInterval(checkForNewTweets, 60000);

// Lancer une vérification initiale
checkAuthentication().then(checkForNewTweets);