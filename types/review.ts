export type RentalAgreementReview = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
}

export type CreateReviewPayload = {
  rating: number
  comment?: string
}

export type CreatedReview = {
  id: string
  rating: number
  comment: string | null
  tenant: { name: string }
  property: { id: string; title: string }
}
