import VideoFeatureList from './VideoFeatureList';

const items = [
  {
    video: '/videos/renew/renew-onboarding.mp4',
    title: 'Setting up your account',
    description: "Users will get introduced to the application and its goals upon first download, giving them a brief overlook over the company's goals and values. The onboarding process is short and efficient, gathering basic information before users can get started.",
  },
  {
    video: '/videos/renew/renew-new-item.mp4',
    title: 'Adding your first item',
    description: 'Upon creating an account, users will be guided on how to add their first item to their profile, adding photos and a short description.',
  },
  {
    video: '/videos/renew/renew-swapping.mp4',
    title: 'Finding the perfect swap',
    description: "The Explore Feed allows users to scroll through other Swappers' posts, where they can Like or Dislike items. The more Swappers in a user's swapping radius, the more likely they are to find a Swap.",
  },
  {
    video: '/videos/renew/renew-messaging.mp4',
    title: 'Messaging your swapper',
    description: "Once two users mutually decide to swap items (i.e. Like an item on each others' page) they'll be able to contact each other to figure out a meeting place and time.",
  },
  {
    image: '/images/renew/renew-community.png',
    title: 'Connecting with your community.',
    description: 'The Community page allows users to post and discover events - like public clothing swaps - and ask questions to fellow Swappers.',
  },
];

export default function RenewVideoList() {
  return <VideoFeatureList items={items} />;
}
