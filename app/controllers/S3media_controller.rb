class S3mediaController < ApplicationController
  # create the document in rails, then send json back to our javascript to populate the form that will be
  # going to amazon.
  def create
      if ZoomCollection.exists?(:name => params[:collection][:title])
        @document = ZoomCollection.find_by_name(params[:collection][:title])
      else
        @document = ZoomCollection.create(:name => params[:collection][:title])
        @document.save
      end
      @image = ZoomPhoto.create(:collection_id => @document.id);
      s3_key = Date.today.year.to_s + "/" + Date.today.month.to_s + "/" + Date.today.day.to_s + "/" + @image.id.to_s + "." + params[:image][:title].split(".").last
      full_url = "https://s3.amazonaws.com/" + S3["bucket"] + "/" + s3_key
      @image.s3_key = s3_key
      @image.full_url = full_url
      @image.save
      render :json => {
        :success => true,
        :message => "S3 write request approved.",
        :url => @image.full_url,
        :s3 => {
          :policy => s3_upload_policy_document, 
          :signature => s3_upload_signature, 
          :key => @image.s3_key, 
          :success_action_redirect => "/"
        }
      }.to_json
  end
  
  # just in case you need to do anything after the document gets uploaded to amazon.
  # but since we are sending our docs via a hidden iframe, we don't need to show the user a 
  # thank-you page.
  def s3_confirm
    head :ok
  end
 
  private
  
  # generate the policy document that amazon is expecting.
  def s3_upload_policy_document
    return @policy if @policy
    ret = {"expiration" => 5.minutes.from_now.utc.xmlschema,
      "conditions" =>  [ 
        {"bucket" =>  S3["bucket"]}, 
        ["starts-with", "$key", @image.s3_key], 
        {"acl" => "public-read"},
        {"success_action_status" => "200"},
        ["content-length-range", 0, 1048576]
      ]
    }
    @policy = Base64.encode64(ret.to_json).gsub(/\n/,'')
  end

  # sign our request by Base64 encoding the policy document.
  def s3_upload_signature
    signature = Base64.encode64(OpenSSL::HMAC.digest(OpenSSL::Digest::Digest.new('sha1'), S3["secret_access_key"], s3_upload_policy_document)).gsub("\n","")
  end
end