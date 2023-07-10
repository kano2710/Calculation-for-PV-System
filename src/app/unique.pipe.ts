import { Pipe, PipeTransform } from '@angular/core';
interface Project {
  name: string;
  [key: string]: any;
}
@Pipe({
  name: 'unique',
  pure: false
})
export class UniquePipe implements PipeTransform {

  transform(value: Project[], field: string): Project[] {
    const arr: Project[] = [];

    value.filter((obj: Project, index: number, self: Project[]) => {
      return index === self.findIndex((el: Project) => (
        el[field] === obj[field]
      ));
    }).forEach((item: Project) => arr.push(item));

    return arr;
  }

}