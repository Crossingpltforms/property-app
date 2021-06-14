export const propertyListArr = (propArr) => {
  const propListArr = []
  propArr && propArr.forEach((item) => {
    const propertyObj = {
      id: item.id,
      name: item.name,
      address: item.address,
      roomType: item.roomType,
      type: item.type,
      price: item.price,
      KOH: item.KOH,
      noDeposit: item.noDeposit,
      images: [item.images[0]],
      boostExpiry: item.boostExpiry,
      sqft: item.sqft,
      furnishType: item.furnishType,
      bedroom: item.bedroom,
      bathroom: item.bathroom,
      bathroomType: item.bathroomType,
      carpark: item.carpark,
      videos: item.videos
    }
    propListArr.push(propertyObj)
  })
  return propListArr
}
