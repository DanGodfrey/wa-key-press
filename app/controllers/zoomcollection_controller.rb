class ZoomcollectionController < ApplicationController
  def getImages
     collection = ZoomCollection.find_by_name(params[:name])
     images = ZoomPhoto.find_all_by_collection_id(collection.id)
     render :json => {
        :success => true,
        :message => "Returned images",
        :images => images
      }.to_json
  end
end