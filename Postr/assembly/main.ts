// smart contract source code, written in AssemblyScript
// for more info: https://docs.near.org/docs/roles/developer/contracts/assemblyscript

import { context, storage, base58,math  } from "near-sdk-as";
import {Post, postCollection, PostList} from './model'


// ID Generator Method

function _genId(): string{
  const buffer = math.randomBuffer(8)
  var randomId = base58.encode(buffer)
  return randomId.replaceAll('/','').toLowerCase()
}


// Create Post Method

export function createPost(
    title: string,
    body : string
): Post{
      const post_id = _genId()
      const _p = new Post()
      _p.id = post_id
      _p.originalId = post_id
      _p.title = title
      _p.body = body
      _p.owner = context.sender
      _p.createdAt = context.blockTimestamp

    const list = postCollection.get('list')
    if(list){
      list.data.push(_p)
      postCollection.set('list', list)
    }else{
      const newList = new PostList()
      newList.data = [_p]
      postCollection.set('list', newList)
    }
    return _p

}

// Method to return all Posts
export function getAllPosts(): Post[]{
  let result: Post[] = []
  const postList = postCollection.get('list')
  if(!postList){
    return []
  }
  for(let id = 0; id < postList.data.length; id++){
    const post = postList.data[id]
    result.push(post)
  }
  return result
}

// Get Post using its id
export function getPostById(id: string): Post | null{
  const result: Post[] = []
  const postList = postCollection.get('list')
  if(!postList) {
    return null
  }
  for(let _id = 0; _id < postList.data.length; _id++){
    const post = postList.data[_id]
    if(id == post.id){
      result.push(post)
      break
    }
  }
  if(result.length > 0){
    return result[0]
  }
  else {
    return null
  }
}


export function editPost(id: string, _post: string): void {
  const post = getPostById(id);
  if (post) post.body = _post;
}
