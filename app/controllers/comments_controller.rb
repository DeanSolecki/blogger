class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :edit, :update, :destroy]
	devise_token_auth_group :member, contains: [:user, :admin]
	before_action :authenticate_member!, :except => [:index, :show]

  respond_to :json

  def index
    @comments = Comment.all
    respond_with(@comments)
  end

  def show
    respond_with(@comment)
  end

  def new
    @comment = Comment.new
    respond_with(@comment)
  end

  def edit
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.save
    respond_with(@comment)
  end

  def update
    @comment.update(comment_params)
    respond_with(@comment)
  end

  def destroy
    @comment.destroy
    respond_with(@comment)
  end

  private
    def set_comment
      @comment = Comment.find(params[:id])
    end

    def comment_params
      params.require(:comment).permit(:post_id, :body, :commentable_id, :commentable_type)
    end
end
