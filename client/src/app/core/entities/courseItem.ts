let _idSequence: number = parseInt(localStorage.getItem('id-sequence')) || 0;

export  class CourseItem {

	public id: number = _idSequence++;

	public title: string;
	public subTitle: string;
	public creationDate: string;
	public duration: string;

	constructor (title: string, subTitle: string, crationDate: string, duration: string) {
		this.title = title;
		this.subTitle = subTitle;
		this.creationDate = crationDate;
		this.duration = duration;
		localStorage.setItem('id-sequence', _idSequence.toString());
	}
}
