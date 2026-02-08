import { getListings } from '../lib/db';
import HomeClient from '../components/HomeClient';

export default function Home() {
    const listings = getListings();
    const featuredListings = listings.slice(0, 6); // Show top 6

    return <HomeClient featuredListings={featuredListings} />;
}
