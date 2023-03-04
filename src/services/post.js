





export function getCompetitionPosts(posts, id) {
  return posts.filter((post) => post.competitionId === id)
}