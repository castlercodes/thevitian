import {NextResponse} from 'next/server';
import {db} from '@/lib/firebase'
import {collection, query, where, getDocs} from "firebase/firestore";

export async function GET(request, {params}){
    const {title} = params;

    const q = query(collection(db, "posts"), where("formattedTitle", "==", title));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty){
        const postData = querySnapshot.docs[0].data();
        return NextResponse.json(postData);
    }
    else{
        return NextResponse.json({error: "Post not found"}, {status: 404});
    }
}